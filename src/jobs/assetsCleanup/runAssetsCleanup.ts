import type { Payload } from 'payload';
import type {
  InterfaceAssetsCleanupReport,
  InterfaceAssetSnapshot,
  InterfaceDeletionResult,
  InterfaceNotificationResult,
  InterfaceTenantReport,
} from '@/jobs/assetsCleanup/types';
import {
  type InterfaceAssetsCleanupConfig, type InterfaceAssetsCleanupOptions, resolveAssetsCleanupConfig,
} from '@/jobs/assetsCleanup/config';
import {
  findInvariantViolations, mergeScanResults, scanReferences,
} from '@/jobs/assetsCleanup/scanReferences';
import {
  buildCorpus, evaluateTenantAssets, getCutoff, loadAssets,
} from '@/jobs/assetsCleanup/evaluate';
import { deleteCandidate } from '@/jobs/assetsCleanup/deleteAsset';
import {
  buildSummaryText, countDeletions, sumBytes, sumDeletedBytes,
} from '@/jobs/assetsCleanup/report';
import { sendReportMails } from '@/jobs/assetsCleanup/notify/mail';
import {
  sendSlackFailure, sendSlackNotification,
} from '@/jobs/assetsCleanup/notify/slack';

// ########################################################################
// Orchestration of a single cleanup run
// ########################################################################

interface InterfaceRunArgs {
  jobUrl?: string;
  options?: InterfaceAssetsCleanupOptions | null;
  payload: Payload;
}

interface InterfaceTenantInfo {
  id: string;
  name: string;
  slug: string;
}

const loadTenants = async (payload: Payload): Promise<InterfaceTenantInfo[]> => {
  const tenants = await payload.find({
    collection: 'tenants',
    depth: 0,
    limit: 1000,
    pagination: false,
    sort: 'name',
  });

  return tenants.docs.map((tenant) => ({
    id: String(tenant.id),
    name: tenant.name,
    slug: tenant.slug,
  }));
};

const groupAssetsByTenant = (assets: InterfaceAssetSnapshot[]): {
  byTenant: Map<string, InterfaceAssetSnapshot[]>;
  unassigned: InterfaceAssetSnapshot[];
} => {
  const byTenant = new Map<string, InterfaceAssetSnapshot[]>();
  const unassigned: InterfaceAssetSnapshot[] = [];

  assets.forEach((asset) => {
    if (!asset.tenant) {
      unassigned.push(asset);

      return;
    }

    const list = byTenant.get(asset.tenant) || [];

    list.push(asset);
    byTenant.set(asset.tenant, list);
  });

  return {
    byTenant,
    unassigned,
  };
};

const executeRun = async ({
  config,
  jobUrl,
  payload,
}: {
  config: InterfaceAssetsCleanupConfig;
  jobUrl?: string;
  payload: Payload;
}): Promise<InterfaceAssetsCleanupReport> => {
  const startedAt = new Date();
  const cutoff = getCutoff(startedAt, config.minAgeDays);

  payload.logger.info(`[assetsCleanup] start (env=${config.env}, mode=${config.mode}, minAgeDays=${config.minAgeDays})`);

  // 1. scan all content
  const scan = await scanReferences({
    payload,
  });

  // 2. race protection: re-scan everything which changed during the scan
  if (scan.errors.length < 1) {
    const rescan = await scanReferences({
      payload,
      since: scan.scanStart,
    });

    mergeScanResults(scan, rescan);
  }

  // 3. invariant check between the two collectors
  const invariantViolations = findInvariantViolations(scan);

  // (this is reported in the slack message and the mail, see report.ts)
  if (invariantViolations.length > 0) {
    payload.logger.error(`[assetsCleanup] invariant violated: schema collector found ${invariantViolations.length} id(s) unknown to the generic collector.`);
  }

  // 4. global fuses
  const globalFuses: string[] = [];

  if (scan.errors.length > 0) {
    globalFuses.push(`Scan errors: ${scan.errors.join(' | ')}`);
  }

  if (invariantViolations.length > 0) {
    globalFuses.push('Reference collectors disagree (see invariantViolations).');
  }

  if (scan.stats.docs < 1) {
    globalFuses.push('No content documents were scanned.');
  }

  if (config.mode !== 'delete') {
    globalFuses.push(config.modeReason);
  }

  // 5. evaluate assets per tenant
  const assets = await loadAssets(payload);
  const tenants = await loadTenants(payload);
  const {
    byTenant, unassigned,
  } = groupAssetsByTenant(assets);
  const corpus = buildCorpus(scan);
  const tenantReports: InterfaceTenantReport[] = [];
  const deletionAllowedGlobally = globalFuses.length < 1;

  const relevantTenants = tenants.filter((tenant) => !config.tenantIds || config.tenantIds.includes(tenant.id));

  // assets whose tenant does not exist anymore
  const knownTenantIds = new Set(tenants.map((tenant) => tenant.id));

  byTenant.forEach((tenantAssets, tenantId) => {
    if (!knownTenantIds.has(tenantId)) {
      unassigned.push(...tenantAssets);
    }
  });

  for await (const tenant of relevantTenants) {
    const tenantAssets = byTenant.get(tenant.id) || [];
    const evaluation = evaluateTenantAssets({
      assets: tenantAssets,
      config,
      corpus,
      cutoff,
      scan,
      tenantId: tenant.id,
    });
    const deletionPerformed = deletionAllowedGlobally && evaluation.fuses.length < 1 && evaluation.candidates.length > 0;
    const deletions: InterfaceDeletionResult[] = [];

    if (deletionPerformed) {
      for await (const candidate of evaluation.candidates) {
        const result = await deleteCandidate({
          candidate,
          config,
          payload,
        });

        payload.logger.info(`[assetsCleanup] ${result.state}: ${candidate.collection}/${candidate.id} (${candidate.filename}) – ${result.message}`);
        deletions.push(result);
      }
    }

    tenantReports.push({
      assets: evaluation.assets,
      candidates: evaluation.candidates,
      deletionPerformed,
      deletions,
      fuses: evaluation.fuses,
      keptFresh: evaluation.keptFresh,
      tenantId: tenant.id,
      tenantName: tenant.name,
      tenantSlug: tenant.slug,
    });
  }

  // 6. totals
  const totals = tenantReports.reduce((accumulator, tenant) => {
    const counts = countDeletions(tenant.deletions);

    return {
      assets: accumulator.assets + tenant.assets.total,
      blobWarnings: accumulator.blobWarnings + counts.blobWarnings,
      candidates: accumulator.candidates + tenant.candidates.length,
      candidatesBytes: accumulator.candidatesBytes + sumBytes(tenant.candidates),
      deleted: accumulator.deleted + counts.deleted,
      deletedBytes: accumulator.deletedBytes + sumDeletedBytes(tenant.deletions),
      failed: accumulator.failed + counts.failed,
      keptFresh: accumulator.keptFresh + tenant.keptFresh.length,
      skipped: accumulator.skipped + counts.skipped,
    };
  }, {
    assets: 0,
    blobWarnings: 0,
    candidates: 0,
    candidatesBytes: 0,
    deleted: 0,
    deletedBytes: 0,
    failed: 0,
    keptFresh: 0,
    skipped: 0,
  });

  const finishedAt = new Date();

  const report: InterfaceAssetsCleanupReport = {
    cutoff: cutoff.toISOString(),
    deletionPerformed: deletionAllowedGlobally,
    durationMs: finishedAt.getTime() - startedAt.getTime(),
    env: config.env,
    finishedAt: finishedAt.toISOString(),
    fuseOverrides: config.fuseOverrides,
    globalFuses,
    invariantViolations,
    minAgeDays: config.minAgeDays,
    mode: config.mode,
    modeReason: config.modeReason,
    notifications: [],
    scan: {
      autoProjects: scan.index.autoProjects.size,
      collections: scan.stats.collections,
      docs: scan.stats.docs,
      errors: scan.errors,
      referencedFilenames: scan.index.filenames.size,
      referencedIds: scan.index.ids.size,
      versionCollections: scan.stats.versionCollections,
      versions: scan.stats.versions,
    },
    startedAt: startedAt.toISOString(),
    tenants: tenantReports,
    totals,
    unassignedAssets: unassigned,
  };

  // 7. notifications (mail first, so that mail failures end up in the
  // slack message as well)
  const notifications: InterfaceNotificationResult[] = [];

  report.notifications = notifications;

  if (config.notifyMail) {
    notifications.push(...await sendReportMails({
      config,
      payload,
      report,
    }));
  }

  if (config.notifySlack && config.slackWebhookUrl) {
    notifications.push(await sendSlackNotification({
      jobUrl,
      report,
      webhookUrl: config.slackWebhookUrl,
    }));
  }

  notifications
    .filter((notification) => !notification.ok)
    .forEach((notification) => {
      payload.logger.error(`[assetsCleanup] ${notification.message}`);
    });

  payload.logger.info(`[assetsCleanup] done\n${buildSummaryText(report)}`);

  return report;
};

export const runAssetsCleanup = async ({
  jobUrl,
  options,
  payload,
}: InterfaceRunArgs): Promise<InterfaceAssetsCleanupReport> => {
  const config = resolveAssetsCleanupConfig(options);

  try {
    return await executeRun({
      config,
      jobUrl,
      payload,
    });
  } catch (error) {
    // the run crashed: no report, no mail. post the reason to slack (prod
    // and test only, like the regular notification) and let the job fail.
    payload.logger.error(`[assetsCleanup] run failed: ${error instanceof Error
      ? error.message
      : String(error)}`);

    if (config.notifySlack && config.slackWebhookUrl) {
      const result = await sendSlackFailure({
        env: config.env,
        error,
        jobUrl,
        webhookUrl: config.slackWebhookUrl,
      });

      if (!result.ok) {
        payload.logger.error(`[assetsCleanup] ${result.message}`);
      }
    }

    throw error;
  }
};
