import type {
  AssetCollectionSlug, AssetsCleanupEnv, AssetsCleanupMode,
} from '@/jobs/assetsCleanup/config';

// ########################################################################
// Reference index (result of the scan)
// ########################################################################

export interface InterfaceReferenceIndex {

  // project ids used by downloads blocks in "auto" mode
  autoProjects: Set<string>;

  // every ObjectId-like string found anywhere in the content
  ids: Set<string>;

  // every filename-like token found anywhere in the content
  filenames: Set<string>;

  // every url-like token found anywhere in the content (for the final
  // substring check on candidates)
  urlCorpus: Set<string>;
}

interface InterfaceScanStats {
  collections: string[];
  docs: number;
  versionCollections: string[];
  versions: number;
}

export interface InterfaceScanResult {
  errors: string[];
  index: InterfaceReferenceIndex;
  scanStart: Date;

  // ids found by the schema-aware collector. must be a subset of index.ids
  schemaIds: Set<string>;
  stats: InterfaceScanStats;
}

// ########################################################################
// Assets
// ########################################################################

export interface InterfaceAssetSnapshot {
  collection: AssetCollectionSlug;
  createdAt: string;
  filename: string;
  filesize: number | null;
  id: string;
  label: string;
  mimeType: string | null;
  project: string | null;
  tenant: string | null;
  updatedAt: string;
}

export interface InterfaceAssetCandidate extends InterfaceAssetSnapshot {
  adminUrl: string;
}

export interface InterfaceAssetKept extends InterfaceAssetSnapshot {
  reasons: string[];
}

// ########################################################################
// Deletion
// ########################################################################

export type DeletionState = 'blobNotVerified' | 'blobStillPresent' | 'deleted' | 'failed' | 'skipped';

export interface InterfaceDeletionResult {
  candidate: InterfaceAssetCandidate;
  message: string;
  state: DeletionState;
}

// ########################################################################
// Report
// ########################################################################

export interface InterfaceTenantAssetCounts {
  documents: number;
  images: number;
  total: number;
  videos: number;
}

export interface InterfaceTenantReport {
  assets: InterfaceTenantAssetCounts;
  candidates: InterfaceAssetCandidate[];
  deletionPerformed: boolean;
  deletions: InterfaceDeletionResult[];

  // reasons why deletion was blocked for this tenant
  fuses: string[];

  // unreferenced assets which are still inside the safety window
  keptFresh: InterfaceAssetKept[];
  tenantId: string;
  tenantName: string;
  tenantSlug: string;
}

export interface InterfaceNotificationResult {
  channel: 'mail' | 'slack';
  message: string;
  ok: boolean;
  target: string;
}

interface InterfaceAssetsCleanupTotals {
  assets: number;
  blobWarnings: number;
  candidates: number;

  // sum of the file sizes of all candidates
  candidatesBytes: number;
  deleted: number;

  // sum of the file sizes of the actually deleted assets
  deletedBytes: number;
  failed: number;
  keptFresh: number;
  skipped: number;
}

export interface InterfaceAssetsCleanupReport {
  cutoff: string;
  deletionPerformed: boolean;
  durationMs: number;
  env: AssetsCleanupEnv;
  finishedAt: string;
  fuseOverrides: string[];

  // reasons why deletion was blocked for the whole run
  globalFuses: string[];
  invariantViolations: string[];
  minAgeDays: number;
  mode: AssetsCleanupMode;
  modeReason: string;
  notifications: InterfaceNotificationResult[];
  scan: {
    autoProjects: number;
    collections: string[];
    docs: number;
    errors: string[];
    referencedFilenames: number;
    referencedIds: number;
    versionCollections: string[];
    versions: number;
  };
  startedAt: string;
  tenants: InterfaceTenantReport[];
  totals: InterfaceAssetsCleanupTotals;

  // assets without a tenant are never deleted, but listed
  unassignedAssets: InterfaceAssetSnapshot[];
}
