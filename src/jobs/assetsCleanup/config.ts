// ########################################################################
// Assets cleanup: configuration
//
// Resolves all runtime settings of the assets cleanup job from the
// environment and from optional overrides (task input). All safety
// relevant defaults live here so they can be reviewed in one place.
// ########################################################################

export const assetCollectionSlugs = [
  'images',
  'videos',
  'documents',
] as const;

export type AssetCollectionSlug = typeof assetCollectionSlugs[number];

export const isAssetCollectionSlug = (slug: string): slug is AssetCollectionSlug => (assetCollectionSlugs as readonly string[]).includes(slug);

// Collections which must never be scanned for references:
// - the asset collections themselves (a doc would "reference" its own id)
// - the jobs collection: the report of previous runs contains the ids of
//   candidates, which would make them look "used" forever
// - migrations: no content
export const excludedScanCollections = [
  ...assetCollectionSlugs,
  'payload-jobs',
  'payload-migrations',
];

export type AssetsCleanupEnv = 'local' | 'playwright' | 'prod' | 'test' | 'unknown';
export type AssetsCleanupMode = 'delete' | 'report';

const assetsCleanupFallbackMail = 'vorhall23@gmail.com';

export const assetsCleanupDefaults = {
  maxDeleteAbsolute: 50,
  maxDeletePercent: 25,
  minAgeDaysNonProd: 1,
  minAgeDaysProd: 21,

  // the percent fuse only makes sense with a minimum amount of candidates.
  // otherwise a tenant with 4 assets and 2 unused ones could never be cleaned.
  percentFuseMinCandidates: 10,
} as const;

export interface InterfaceAssetsCleanupOptions {

  // Overrides the mode. On prod and test, 'delete' is only effective when
  // the env variable ASSETS_CLEANUP_MODE is set to 'delete' as well.
  mode?: AssetsCleanupMode | null;

  // Overrides the age window in days. On prod, values below the default
  // are ignored.
  minAgeDays?: number | null;

  // Restrict the run to specific tenants (ids). References are still
  // collected across all tenants.
  tenantIds?: string[] | null;

  // Explicitly enable or disable notifications (mail and slack).
  notify?: boolean | null;

  // Safety fuses
  maxDeletePercent?: number | null;
  maxDeleteAbsolute?: number | null;
}

export interface InterfaceAssetsCleanupConfig {
  blobToken: string | undefined;
  env: AssetsCleanupEnv;
  fallbackMail: string;
  fuseOverrides: string[];
  maxDeleteAbsolute: number;
  maxDeletePercent: number;
  minAgeDays: number;
  mode: AssetsCleanupMode;
  modeReason: string;
  notifyMail: boolean;
  notifySlack: boolean;
  percentFuseMinCandidates: number;
  serverUrl: string;
  slackWebhookUrl: string | undefined;
  tenantIds: string[] | undefined;
}

const resolveAssetsCleanupEnv = (): AssetsCleanupEnv => {
  const env = process.env.ENV;

  if (env === 'prod' || env === 'test' || env === 'local' || env === 'playwright') {
    return env;
  }

  // no ENV set outside of a production build (e.g. playwright run without
  // ENV, plain `next dev`): this can only be a local machine
  if (process.env.NODE_ENV !== 'production') {
    return 'local';
  }

  // no ENV set inside a production build: treat like prod (conservative
  // window, deletion only via ASSETS_CLEANUP_MODE), but without
  // notifications to real people
  return 'unknown';
};

const resolveMode = ({
  env,
  requestedMode,
}: {
  env: AssetsCleanupEnv;
  requestedMode: AssetsCleanupMode | null | undefined;
}): {
  mode: AssetsCleanupMode;
  reason: string;
} => {
  const envMode = process.env.ASSETS_CLEANUP_MODE;

  // when in doubt, do not delete: an environment we cannot identify never
  // deletes, regardless of ASSETS_CLEANUP_MODE or the requested mode.
  if (env === 'unknown') {
    return {
      mode: 'report',
      reason: 'Environment could not be determined (ENV is not set). Nothing will be deleted.',
    };
  }

  if (requestedMode === 'report') {
    return {
      mode: 'report',
      reason: 'Report-only mode was requested explicitly.',
    };
  }

  const isDeployedEnv = env === 'prod' || env === 'test';

  if (isDeployedEnv) {
    if (envMode === 'delete') {
      return {
        mode: 'delete',
        reason: 'ASSETS_CLEANUP_MODE=delete is set.',
      };
    }

    return {
      mode: 'report',
      reason: 'ASSETS_CLEANUP_MODE is not set to "delete". Nothing will be deleted.',
    };
  }

  // local and playwright: the caller decides
  if (requestedMode === 'delete' || envMode === 'delete') {
    return {
      mode: 'delete',
      reason: 'Delete mode requested on a non-deployed environment.',
    };
  }

  return {
    mode: 'report',
    reason: 'Report-only mode (default). Nothing will be deleted.',
  };
};

const resolveMinAgeDays = ({
  env,
  requested,
}: {
  env: AssetsCleanupEnv;
  requested: number | null | undefined;
}): number => {
  const isProdLike = env === 'prod' || env === 'unknown';
  const defaultDays = isProdLike
    ? assetsCleanupDefaults.minAgeDaysProd
    : assetsCleanupDefaults.minAgeDaysNonProd;

  if (typeof requested !== 'number' || !Number.isFinite(requested) || requested < 0) {
    return defaultDays;
  }

  // on prod, the window can only be extended, never shortened
  if (isProdLike) {
    return Math.max(defaultDays, requested);
  }

  return requested;
};

// Fuse limits: the base value is the default, or – if set – the env
// variable override. Env variables are the trusted channel on deployed
// environments (like ASSETS_CLEANUP_MODE): only ops can loosen a fuse, e.g.
// for the initial cleanup of a large backlog. Task input can tighten the
// limits everywhere, but loosen them only on non-deployed environments
// (needed by the automated tests).
export const fuseOverrideEnvVars = {
  maxDeleteAbsolute: 'ASSETS_CLEANUP_MAX_DELETE_ABSOLUTE',
  maxDeletePercent: 'ASSETS_CLEANUP_MAX_DELETE_PERCENT',
} as const;

const readEnvLimit = (name: string): number | undefined => {
  const raw = process.env[name];

  if (!raw) {
    return undefined;
  }

  const parsed = Number(raw);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
};

const resolveFuseLimit = ({
  defaultValue,
  env,
  envVar,
  label,
  overrides,
  requested,
}: {
  defaultValue: number;
  env: AssetsCleanupEnv;
  envVar: string;
  label: string;
  overrides: string[];
  requested: number | null | undefined;
}): number => {
  const envLimit = readEnvLimit(envVar);
  let base = defaultValue;

  if (envLimit !== undefined && envLimit !== defaultValue) {
    base = envLimit;
    overrides.push(`${label} set to ${envLimit} via ${envVar} (default ${defaultValue}).`);
  }

  if (typeof requested !== 'number' || !Number.isFinite(requested) || requested <= 0) {
    return base;
  }

  const isDeployedEnv = env === 'prod' || env === 'test' || env === 'unknown';

  if (isDeployedEnv) {
    return Math.min(base, requested);
  }

  return requested;
};

export const resolveAssetsCleanupConfig = (options?: InterfaceAssetsCleanupOptions | null): InterfaceAssetsCleanupConfig => {
  const env = resolveAssetsCleanupEnv();
  const {
    mode, reason,
  } = resolveMode({
    env,
    requestedMode: options?.mode,
  });

  const notifyRequested = options?.notify;
  const isNotifyingEnv = env !== 'playwright';
  const notifyMail = notifyRequested === true || (notifyRequested !== false && isNotifyingEnv);
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL_ASSETS_DELETE || undefined;
  const isSlackEnv = env !== 'playwright';
  const notifySlack = Boolean(slackWebhookUrl) && isSlackEnv && notifyRequested !== false;

  const tenantIds = Array.isArray(options?.tenantIds) && options.tenantIds.length > 0
    ? options.tenantIds
    : undefined;

  const fuseOverrides: string[] = [];
  const maxDeleteAbsolute = resolveFuseLimit({
    defaultValue: assetsCleanupDefaults.maxDeleteAbsolute,
    env,
    envVar: fuseOverrideEnvVars.maxDeleteAbsolute,
    label: 'Absolute limit',
    overrides: fuseOverrides,
    requested: options?.maxDeleteAbsolute,
  });
  const maxDeletePercent = resolveFuseLimit({
    defaultValue: assetsCleanupDefaults.maxDeletePercent,
    env,
    envVar: fuseOverrideEnvVars.maxDeletePercent,
    label: 'Percent limit',
    overrides: fuseOverrides,
    requested: options?.maxDeletePercent,
  });

  return {
    blobToken: process.env.BLOB_READ_WRITE_TOKEN || undefined,
    env,
    fallbackMail: assetsCleanupFallbackMail,
    fuseOverrides,
    maxDeleteAbsolute,
    maxDeletePercent,
    minAgeDays: resolveMinAgeDays({
      env,
      requested: options?.minAgeDays,
    }),
    mode,
    modeReason: reason,
    notifyMail,
    notifySlack,
    percentFuseMinCandidates: assetsCleanupDefaults.percentFuseMinCandidates,
    serverUrl: (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/$/u, ''),
    slackWebhookUrl,
    tenantIds,
  };
};
