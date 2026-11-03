/**
 * Fathom site IDs per tenant.
 *
 * Every tenant gets its own Fathom dashboard. The mapping is kept in code.
 *
 * Resolution rules (see `resolveFathomSiteId`):
 * - prod: the map is the only source of truth. A tenant that is not listed
 *   here is NOT tracked at all.
 * - test / playwright / local / unknown: map entry, else the shared site in
 *   `NEXT_PUBLIC_TRACKING_SITE_ID`, else tracking is off.
 *
 * No `next/*` imports here: this file is imported by Playwright specs.
 */

export type FathomEnvironment = 'playwright' | 'prod' | 'test';
export type FathomSitesMap = Record<FathomEnvironment, Record<string, string>>;
export const fathomSites: FathomSitesMap = {
  // Shared playwright site via NEXT_PUBLIC_TRACKING_SITE_ID (.env.playwright)
  // for `sagw` so `tracking.be.spec.ts` (real Fathom API) keeps working.
  // `not-sagw` gets a fake id which is only asserted by the stubbed tests.
  playwright: {
    'not-sagw': 'PWNOTSAGW',
  },

  // One Fathom site per tenant: tenant slug -> Fathom site id.
  prod: {
    codices: 'FZXNDNCB',
    collrom: 'GOZWNRRR',
    mimos: 'GFFJPYGJ',
    sag: 'JVKEVRSE',
    sago: 'ZEWOEKQD',
    sagw: 'LZIJGWTS',
    sanas: 'LQAUCHHG',
    saute: 'SKBWJPOH',
    seg: 'XSLIOGDH',
    sga: 'MZOYPXJH',
    sgas: 'JKVDYVAW',
    sgavl: 'BOZSKLCM',
    sgb: 'MYHCSNBQ',
    sgbe: 'MGGZJZRK',
    sgbf: 'ZNUWGDDR',
    sgg: 'MLAGUIEQ',
    sggf: 'QJVZBYHN',
    sgjf: 'GSJXAJYA',
    sgks: 'FIWBGNMW',
    sgmoik: 'EACHWBLF',
    sgr: 'CBDFBXTW',
    sgss: 'TFEJEODM',
    smg: 'QEMXBDHW',
    spg: 'AKOGSUNL',
    sseh: 'TUGOREBQ',
    ssg: 'KKXUNQZU',
    sslas: 'IKSCWWYZ',
    sthg: 'RWSIHNJL',
    svaw: 'MSICBSHI',
  },

  // Shared test site via NEXT_PUBLIC_TRACKING_SITE_ID (.env.test)
  test: {},
};

const isFathomEnvironment = (env: string | undefined): env is FathomEnvironment => env === 'prod' || env === 'test' || env === 'playwright';

export const resolveFathomSiteId = ({
  env = process.env.ENV,
  fallbackSiteId = process.env.NEXT_PUBLIC_TRACKING_SITE_ID,
  tenantSlug,
}: {
  env?: string;
  fallbackSiteId?: string;
  tenantSlug: string | null | undefined;
}): string | undefined => {
  const mapped = isFathomEnvironment(env) && tenantSlug
    ? fathomSites[env][tenantSlug]
    : undefined;

  // prod: the map is the only source of truth. Unmapped tenant = no tracking.
  if (env === 'prod') {
    return mapped || undefined;
  }

  // test / playwright / local / unknown: map entry, else shared site, else off
  return mapped || fallbackSiteId || undefined;
};
