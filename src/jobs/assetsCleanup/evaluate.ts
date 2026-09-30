import type { Payload } from 'payload';
import type {
  InterfaceAssetCandidate,
  InterfaceAssetKept,
  InterfaceAssetSnapshot,
  InterfaceScanResult,
  InterfaceTenantAssetCounts,
} from '@/jobs/assetsCleanup/types';
import {
  type AssetCollectionSlug, assetCollectionSlugs, type InterfaceAssetsCleanupConfig,
} from '@/jobs/assetsCleanup/config';
import { isRecord } from '@/jobs/assetsCleanup/collectGeneric';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';

// ########################################################################
// Evaluation: which assets are candidates for deletion?
// ########################################################################

const msPerDay = 24 * 60 * 60 * 1000;

const firstLocalizedString = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    return value;
  }

  if (isRecord(value)) {
    const found = Object.values(value)
      .find((entry) => typeof entry === 'string' && entry.trim().length > 0);

    return typeof found === 'string'
      ? found
      : undefined;
  }

  return undefined;
};

const firstLocalizedRte = (value: unknown): string | undefined => {
  const toText = (entry: unknown): string => {
    if (!isRecord(entry) || !('root' in entry)) {
      return '';
    }

    try {
      return rte1ToPlaintext(entry as any)
        .trim();
    } catch {
      return '';
    }
  };

  if (isRecord(value) && 'root' in value) {
    return toText(value);
  }

  if (isRecord(value)) {
    const found = Object.values(value)
      .map((entry) => toText(entry))
      .find((entry) => entry.length > 0);

    return found;
  }

  return undefined;
};

const toIdString = (value: unknown): string | null => {
  if (typeof value === 'string' && value.length > 0) {
    return value.toLowerCase();
  }

  if (isRecord(value) && typeof value.id === 'string') {
    return value.id.toLowerCase();
  }

  return null;
};

const toDateString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return '';
};

const toSnapshot = (raw: unknown, collection: AssetCollectionSlug): InterfaceAssetSnapshot | null => {
  const doc: unknown = JSON.parse(JSON.stringify(raw));

  if (!isRecord(doc)) {
    return null;
  }

  const id = toIdString(doc._id) || toIdString(doc.id);

  if (!id) {
    return null;
  }

  let label: string | undefined;

  if (collection === 'images') {
    label = firstLocalizedString(doc.alt);
  } else if (collection === 'videos') {
    label = firstLocalizedString(doc.title);
  } else {
    label = firstLocalizedRte(doc.title);
  }

  return {
    collection,
    createdAt: toDateString(doc.createdAt),
    filename: typeof doc.filename === 'string'
      ? doc.filename
      : '',
    filesize: typeof doc.filesize === 'number'
      ? doc.filesize
      : null,
    id,
    label: label || '',
    mimeType: typeof doc.mimeType === 'string'
      ? doc.mimeType
      : null,
    project: toIdString(doc.project),
    tenant: toIdString(doc.tenant),
    updatedAt: toDateString(doc.updatedAt),
  };
};

// loads all assets of all asset collections directly from the db
export const loadAssets = async (payload: Payload): Promise<InterfaceAssetSnapshot[]> => {
  const assets: InterfaceAssetSnapshot[] = [];

  for await (const collection of assetCollectionSlugs) {
    const model = payload.db.collections[collection];

    if (model) {
      const docs = await model
        .find({})
        .lean();

      docs.forEach((doc) => {
        const snapshot = toSnapshot(doc, collection);

        if (snapshot) {
          assets.push(snapshot);
        }
      });
    }
  }

  return assets;
};

const encodeFilename = (filename: string): string => {
  try {
    return encodeURIComponent(filename);
  } catch {
    return filename;
  }
};

// returns the reasons why an asset counts as "used". empty = unreferenced.
const getReferenceReasons = (asset: InterfaceAssetSnapshot, scan: InterfaceScanResult, corpus: string): string[] => {
  const reasons: string[] = [];
  const {
    index,
  } = scan;

  if (index.ids.has(asset.id)) {
    reasons.push('id is referenced');
  }

  if (asset.filename.length > 0) {
    const encoded = encodeFilename(asset.filename);

    if (index.filenames.has(asset.filename) || index.filenames.has(encoded)) {
      reasons.push('filename is referenced');
    }

    if (corpus.includes(asset.filename) || corpus.includes(encoded)) {
      reasons.push('filename occurs inside a url');
    }
  }

  if (corpus.includes(asset.id)) {
    reasons.push('id occurs inside a url');
  }

  if (asset.collection === 'documents' && asset.project && index.autoProjects.has(asset.project)) {
    reasons.push('project is used by an automatic downloads block');
  }

  if (asset.filename.length < 1) {
    // an asset without filename is broken. we do not touch it.
    reasons.push('asset has no filename');
  }

  return reasons;
};

const isOlderThanCutoff = (asset: InterfaceAssetSnapshot, cutoff: Date): boolean => {
  const created = Date.parse(asset.createdAt);
  const updated = Date.parse(asset.updatedAt);

  if (Number.isNaN(created) || Number.isNaN(updated)) {
    // unknown dates: treat as fresh (do not delete)
    return false;
  }

  return created < cutoff.getTime() && updated < cutoff.getTime();
};

export const getCutoff = (now: Date, minAgeDays: number): Date => new Date(now.getTime() - (minAgeDays * msPerDay));

const buildAdminUrl = (asset: InterfaceAssetSnapshot, serverUrl: string): string => `${serverUrl}/admin/collections/${asset.collection}/${asset.id}`;

const countAssets = (assets: InterfaceAssetSnapshot[]): InterfaceTenantAssetCounts => ({
  documents: assets.filter((asset) => asset.collection === 'documents').length,
  images: assets.filter((asset) => asset.collection === 'images').length,
  total: assets.length,
  videos: assets.filter((asset) => asset.collection === 'videos').length,
});

interface InterfaceTenantEvaluation {
  assets: InterfaceTenantAssetCounts;
  candidates: InterfaceAssetCandidate[];
  fuses: string[];
  keptFresh: InterfaceAssetKept[];
  tenantId: string;
}

export const evaluateTenantAssets = ({
  assets,
  config,
  cutoff,
  scan,
  tenantId,
  corpus,
}: {
  assets: InterfaceAssetSnapshot[];
  config: InterfaceAssetsCleanupConfig;
  corpus: string;
  cutoff: Date;
  scan: InterfaceScanResult;
  tenantId: string;
}): InterfaceTenantEvaluation => {
  const candidates: InterfaceAssetCandidate[] = [];
  const keptFresh: InterfaceAssetKept[] = [];

  assets.forEach((asset) => {
    const reasons = getReferenceReasons(asset, scan, corpus);

    if (reasons.length > 0) {
      return;
    }

    if (!isOlderThanCutoff(asset, cutoff)) {
      keptFresh.push({
        ...asset,
        reasons: [`inside safety window of ${config.minAgeDays} day(s)`],
      });

      return;
    }

    candidates.push({
      ...asset,
      adminUrl: buildAdminUrl(asset, config.serverUrl),
    });
  });

  const fuses: string[] = [];

  if (candidates.length > config.maxDeleteAbsolute) {
    fuses.push(`${candidates.length} candidates exceed the absolute limit of ${config.maxDeleteAbsolute}.`);
  }

  if (assets.length > 0 && candidates.length >= config.percentFuseMinCandidates) {
    const percent = (candidates.length / assets.length) * 100;

    if (percent > config.maxDeletePercent) {
      fuses.push(`${candidates.length} of ${assets.length} assets (${percent.toFixed(1)}%) exceed the limit of ${config.maxDeletePercent}%.`);
    }
  }

  return {
    assets: countAssets(assets),
    candidates,
    fuses,
    keptFresh,
    tenantId,
  };
};

// builds the corpus of url-like strings for the substring check
export const buildCorpus = (scan: InterfaceScanResult): string => [...scan.index.urlCorpus].join('\n');
