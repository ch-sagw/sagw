import type {
  InterfaceAssetsCleanupReport,
  InterfaceAssetSnapshot,
  InterfaceDeletionResult,
  InterfaceTenantReport,
} from '@/jobs/assetsCleanup/types';

// ########################################################################
// Report rendering (plain text summary, slack text, html mail)
// ########################################################################

const escapeHtml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

export const formatBytes = (bytes: number | null): string => {
  if (bytes === null || !Number.isFinite(bytes)) {
    return '-';
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const formatDate = (value: string): string => {
  const parsed = Date.parse(value);

  if (Number.isNaN(parsed)) {
    return value || '-';
  }

  return (new Date(parsed))
    .toISOString()
    .substring(0, 10);
};

export const getEnvLabel = (env: InterfaceAssetsCleanupReport['env']): string => {
  switch (env) {
    case 'prod':
      return 'PROD';
    case 'test':
      return 'TEST';
    case 'local':
      return 'LOCAL';
    case 'playwright':
      return 'PLAYWRIGHT';
    default:
      return 'UNKNOWN';
  }
};

export const getModeLabel = (report: InterfaceAssetsCleanupReport): string => (report.deletionPerformed
  ? 'DELETE'
  : 'REPORT ONLY');

export const countDeletions = (deletions: InterfaceDeletionResult[]): {
  blobWarnings: number;
  deleted: number;
  failed: number;
  skipped: number;
} => ({
  blobWarnings: deletions.filter((deletion) => deletion.state === 'blobStillPresent' || deletion.state === 'blobNotVerified').length,
  deleted: deletions.filter((deletion) => deletion.state === 'deleted' || deletion.state === 'blobStillPresent' || deletion.state === 'blobNotVerified').length,
  failed: deletions.filter((deletion) => deletion.state === 'failed').length,
  skipped: deletions.filter((deletion) => deletion.state === 'skipped').length,
});

export const sumBytes = (assets: InterfaceAssetSnapshot[]): number => assets.reduce((total, asset) => total + (asset.filesize || 0), 0);

const isDeletedState = (deletion: InterfaceDeletionResult): boolean => deletion.state === 'deleted' || deletion.state === 'blobStillPresent' || deletion.state === 'blobNotVerified';

export const sumDeletedBytes = (deletions: InterfaceDeletionResult[]): number => sumBytes(deletions
  .filter(isDeletedState)
  .map((deletion) => deletion.candidate));

// "12 candidates (34.5 MB)"
export const withSize = (count: number, bytes: number, label: string): string => `${count} ${label} (${formatBytes(bytes)})`;

// numbered rows: "1", "2", ...
export const rowNumber = (index: number): string => String(index + 1);

export const buildSummaryText = (report: InterfaceAssetsCleanupReport): string => {
  const lines: string[] = [];

  lines.push(`Assets cleanup [${getEnvLabel(report.env)}] - ${getModeLabel(report)}`);
  lines.push(`Scanned ${report.scan.docs} documents and ${report.scan.versions} versions in ${Math.round(report.durationMs / 1000)}s.`);
  lines.push(`Safety window: ${report.minAgeDays} day(s), cutoff ${formatDate(report.cutoff)}.`);
  lines.push(`Assets: ${report.totals.assets}, ${withSize(report.totals.candidates, report.totals.candidatesBytes, 'candidates')}, ${withSize(report.totals.deleted, report.totals.deletedBytes, 'deleted')}, failed: ${report.totals.failed}, still in window: ${report.totals.keptFresh}.`);

  if (report.fuseOverrides.length > 0) {
    lines.push(`:warning: Fuse limits overridden: ${report.fuseOverrides.join(' ')}`);
  }

  if (report.globalFuses.length > 0) {
    lines.push(`Deletion blocked: ${report.globalFuses.join(' | ')}`);
  }

  report.tenants.forEach((tenant) => {
    const counts = countDeletions(tenant.deletions);
    const tenantFuses = tenant.fuses.length > 0
      ? ` - blocked: ${tenant.fuses.join(' | ')}`
      : '';

    lines.push(`- ${tenant.tenantName}: ${tenant.assets.total} assets, ${withSize(tenant.candidates.length, sumBytes(tenant.candidates), 'candidates')}, ${withSize(counts.deleted, sumDeletedBytes(tenant.deletions), 'deleted')}, ${counts.failed} failed${tenantFuses}`);
  });

  if (report.unassignedAssets.length > 0) {
    lines.push(`- ${report.unassignedAssets.length} asset(s) without tenant (never deleted)`);
  }

  return lines.join('\n');
};

// Everything that went wrong during a completed run. An empty list means
// the run was clean (fuses like "report-only mode" are not problems).
export const collectReportProblems = (report: InterfaceAssetsCleanupReport): string[] => {
  const problems: string[] = [];

  report.scan.errors.forEach((error) => {
    problems.push(`Scan error: ${error}`);
  });

  if (report.invariantViolations.length > 0) {
    problems.push(`Reference collectors disagree - ${report.invariantViolations.length} id(s) found by the schema collector but not by the generic collector: ${report.invariantViolations.join(', ')}`);
  }

  if (report.scan.docs < 1) {
    problems.push('No content documents were scanned.');
  }

  report.tenants.forEach((tenant) => {
    tenant.deletions
      .filter((deletion) => deletion.state === 'failed' || deletion.state === 'blobStillPresent')
      .forEach((deletion) => {
        problems.push(`${tenant.tenantName}: ${deletion.candidate.collection}/${deletion.candidate.id} (${deletion.candidate.filename}) – ${deletion.message}`);
      });
  });

  report.notifications
    .filter((notification) => !notification.ok)
    .forEach((notification) => {
      problems.push(notification.message);
    });

  return problems;
};

export const buildSlackText = (report: InterfaceAssetsCleanupReport, jobUrl?: string): string => {
  const problems = collectReportProblems(report);
  const lines: string[] = [];

  if (problems.length > 0) {
    lines.push(`:rotating_light: [${getEnvLabel(report.env)}] Assets cleanup finished WITH PROBLEMS`);
    lines.push('');
  }

  lines.push(buildSummaryText(report));

  if (problems.length > 0) {
    lines.push('');
    lines.push('Problems:');
    problems.forEach((problem) => {
      lines.push(`• ${problem}`);
    });
  }

  if (jobUrl) {
    lines.push(`Job: ${jobUrl}`);
  }

  return lines.join('\n');
};

// Message for a run which did not complete at all (exception).
export const buildSlackFailureText = ({
  env,
  error,
  jobUrl,
}: {
  env: InterfaceAssetsCleanupReport['env'];
  error: unknown;
  jobUrl?: string;
}): string => {
  const lines: string[] = [];
  const message = error instanceof Error
    ? error.message
    : String(error);
  const stack = error instanceof Error && error.stack
    ? error.stack
      .split('\n')
      .slice(1, 6)
      .join('\n')
    : '';

  lines.push(`:rotating_light: [${getEnvLabel(env)}] Assets cleanup FAILED - the run aborted before it could finish.`);
  lines.push(`Reason: ${message}`);

  if (stack) {
    lines.push(`Details:\n\`\`\`${stack}\`\`\``);
  }

  if (jobUrl) {
    lines.push(`Job: ${jobUrl}`);
  }

  return lines.join('\n');
};

const renderAssetRows = (assets: InterfaceAssetSnapshot[], extra?: (asset: InterfaceAssetSnapshot) => string): string => assets
  .map((asset, index) => {
    const adminUrl = 'adminUrl' in asset && typeof asset.adminUrl === 'string'
      ? asset.adminUrl
      : '';
    const filenameCell = adminUrl
      ? `<a href="${escapeHtml(adminUrl)}">${escapeHtml(asset.filename)}</a>`
      : escapeHtml(asset.filename);

    return `<tr>
      <td align="right">${rowNumber(index)}</td>
      <td>${escapeHtml(asset.collection)}</td>
      <td>${filenameCell}</td>
      <td>${escapeHtml(asset.label)}</td>
      <td>${formatBytes(asset.filesize)}</td>
      <td>${formatDate(asset.createdAt)}</td>
      <td>${formatDate(asset.updatedAt)}</td>
      ${extra
    ? `<td>${extra(asset)}</td>`
    : ''}
    </tr>`;
  })
  .join('');

const renderTable = (headers: string[], rows: string): string => {
  const headerCells = headers
    .map((header) => `<th align="left">${escapeHtml(header)}</th>`)
    .join('');

  return `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-size:13px;">
  <thead><tr>${headerCells}</tr></thead>
  <tbody>${rows}</tbody>
</table>`;
};

const baseHeaders = [
  '#',
  'Type',
  'File',
  'Title / Alt',
  'Size',
  'Uploaded',
  'Last change',
];

const renderFuseOverrides = (report: InterfaceAssetsCleanupReport): string => (report.fuseOverrides.length > 0
  ? `<p style="color:#a60;"><strong>Safety limits were loosened for this run:</strong> ${escapeHtml(report.fuseOverrides.join(' '))}</p>`
  : '');

const renderIntro = (report: InterfaceAssetsCleanupReport): string => `${renderFuseOverrides(report)}<p><strong>Mode:</strong> ${getModeLabel(report)}<br/>
    <strong>Run:</strong> ${escapeHtml(formatDate(report.startedAt))}<br/>
    <strong>Safety window:</strong> assets are only deleted when they were uploaded and last changed more than ${report.minAgeDays} day(s) ago (before ${escapeHtml(formatDate(report.cutoff))}).</p>
  <h3>What counts as "used"?</h3>
  <p>An asset is considered used when it is referenced anywhere in Payload: in published pages, in drafts, in any older version of a page, in any language, in people, teasers, SEO images, downloads blocks (including automatic downloads by project), or when its link was pasted as text anywhere. Only assets without any such reference are candidates.</p>`;

const renderFooter = (report: InterfaceAssetsCleanupReport): string => `<hr/><p style="font-size:12px;color:#666;">Scanned ${report.scan.docs} documents and ${report.scan.versions} versions across ${report.scan.collections.length} collections in ${Math.round(report.durationMs / 1000)}s.</p>`;

const renderTenantSection = (report: InterfaceAssetsCleanupReport, tenant: InterfaceTenantReport): string => {
  const counts = countDeletions(tenant.deletions);
  const blocked = [
    ...report.globalFuses,
    ...tenant.fuses,
  ];
  const parts: string[] = [];

  parts.push(`<p><strong>Assets of this tenant:</strong> ${tenant.assets.images} images, ${tenant.assets.videos} videos, ${tenant.assets.documents} documents<br/>
    <strong>Unused:</strong> ${withSize(tenant.candidates.length, sumBytes(tenant.candidates), 'candidates')}${tenant.deletionPerformed
  ? `, ${withSize(counts.deleted, sumDeletedBytes(tenant.deletions), 'deleted')}`
  : ''}</p>`);

  if (blocked.length > 0) {
    parts.push('<h3>Deletion was not performed</h3>');
    parts.push(`<ul>${blocked.map((reason) => `<li>${escapeHtml(reason)}</li>`)
      .join('')}</ul>`);
  }

  if (tenant.candidates.length > 0) {
    const title = tenant.deletionPerformed
      ? `Deleted assets (${counts.deleted} of ${tenant.candidates.length} candidates, ${formatBytes(sumDeletedBytes(tenant.deletions))})`
      : `Unused assets which would be deleted (${withSize(tenant.candidates.length, sumBytes(tenant.candidates), 'candidates')})`;

    parts.push(`<h3>${title}</h3>`);

    if (tenant.deletionPerformed) {
      const resultByCandidate = new Map(tenant.deletions.map((deletion) => [
        deletion.candidate.id,
        deletion,
      ]));

      parts.push(renderTable([
        ...baseHeaders,
        'Result',
      ], renderAssetRows(tenant.candidates, (asset) => {
        const result = resultByCandidate.get(asset.id);

        return result
          ? `${escapeHtml(result.state)}: ${escapeHtml(result.message)}`
          : '-';
      })));
    } else {
      parts.push(renderTable(baseHeaders, renderAssetRows(tenant.candidates)));
    }
  } else {
    parts.push('<h3>No unused assets found</h3>');
  }

  if (tenant.keptFresh.length > 0) {
    parts.push(`<h3>Unused, but still inside the safety window (${tenant.keptFresh.length})</h3>`);
    parts.push('<p>These assets are currently not referenced anywhere. They will be deleted in a future run unless they get used.</p>');
    parts.push(renderTable(baseHeaders, renderAssetRows(tenant.keptFresh)));
  }

  return parts.join('\n');
};

const wrapHtml = (body: string): string => `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;">${body}</body></html>`;

// mail for a single tenant (prod: sent to the tenant admins)
export const buildTenantMailHtml = (report: InterfaceAssetsCleanupReport, tenant: InterfaceTenantReport): string => wrapHtml([
  `<h2>Assets cleanup [${getEnvLabel(report.env)}] - ${escapeHtml(tenant.tenantName)}</h2>`,
  renderIntro(report),
  renderTenantSection(report, tenant),
  renderFooter(report),
].join('\n'));

// combined mail with all tenants (non-prod: sent to the fallback address)
export const buildCombinedMailHtml = (report: InterfaceAssetsCleanupReport): string => {
  const parts: string[] = [];

  parts.push(`<h2>Assets cleanup [${getEnvLabel(report.env)}] - all tenants</h2>`);
  parts.push(renderIntro(report));
  parts.push(`<p><strong>Totals:</strong> ${report.totals.assets} assets, ${withSize(report.totals.candidates, report.totals.candidatesBytes, 'candidates')}, ${withSize(report.totals.deleted, report.totals.deletedBytes, 'deleted')}, ${report.totals.failed} failed, ${report.totals.keptFresh} still inside the safety window.</p>`);

  if (report.globalFuses.length > 0) {
    parts.push('<h3>Deletion was not performed</h3>');
    parts.push(`<ul>${report.globalFuses.map((reason) => `<li>${escapeHtml(reason)}</li>`)
      .join('')}</ul>`);
  }

  report.tenants.forEach((tenant) => {
    parts.push(`<hr/><h2>${escapeHtml(tenant.tenantName)}</h2>`);
    parts.push(renderTenantSection({
      ...report,
      globalFuses: [],
    }, tenant));
  });

  if (report.unassignedAssets.length > 0) {
    parts.push(`<hr/><h3>Assets without tenant (${report.unassignedAssets.length}, never deleted)</h3>`);
    parts.push(renderTable(baseHeaders, renderAssetRows(report.unassignedAssets)));
  }

  parts.push(renderFooter(report));

  return wrapHtml(parts.join('\n'));
};
