import { Tenant } from '@/payload-types';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { skipTenantInitialDataContext } from '@/hooks-payload/tenantsAfterChange';
import { addPlaywrightDataForTenant } from '@/seed/test-data/tenantDataPlaywright';
import { tenantRoles } from '@/collections/Plc/Users/roles';

const tenantNonSagwSlug = 'not-sagw';

interface InterfaceGenerateTenantProps {
  slug: string;
  addDefaultTenantData?: boolean;
}

// get's default sagw tenant
export const getTenant = async (): Promise<string | null> => {
  const payload = await getPayloadCached();

  const tenants = await payload.find({
    collection: 'tenants',
    depth: 1,
    where: {
      slug: {
        equals: 'sagw',
      },
    },
  });

  if (!tenants.docs || tenants.docs.length < 1) {
    return null;
  }

  return tenants.docs[0].id;
};

// re-enables all languages on a tenant. other tests (e.g. tenants.be.spec)
// disable languages on the sagw tenant and do not restore them.
export const enableAllTenantLanguages = async (tenantId: string): Promise<void> => {
  const payload = await getPayloadCached();

  await payload.update({
    collection: 'tenants',
    data: {
      languages: {
        de: true,
        en: true,
        fr: true,
        it: true,
      },
    },
    id: tenantId,
    overrideAccess: true,
  });
};

const findTenantNonSagw = async (): Promise<string | null> => {
  const payload = await getPayloadCached();

  const tenants = await payload.find({
    collection: 'tenants',
    depth: 0,
    where: {
      slug: {
        equals: tenantNonSagwSlug,
      },
    },
  });

  if (!tenants.docs || tenants.docs.length < 1) {
    return null;
  }

  return tenants.docs[0].id;
};

// makes sure the seeded not-sagw tenant exists. tests run sequentially
// against one db per shard, so a test that removes this tenant (directly or
// via a tenant cleanup) would break every later spec in the same shard that
// relies on it. if it is missing, it is recreated the same way the seed does
// it (tenant + playwright test data) and the fg-admin user is re-linked to
// it, since the user still points to the old tenant id.
export const ensureTenantNonSagw = async (): Promise<string> => {
  const existing = await findTenantNonSagw();

  if (existing) {
    return existing;
  }

  const payload = await getPayloadCached();

  const tenant = await payload.create({
    collection: 'tenants',
    context: skipTenantInitialDataContext,
    data: {
      name: tenantNonSagwSlug,
      slug: tenantNonSagwSlug,
    },
    overrideAccess: true,
  });

  await addPlaywrightDataForTenant({
    payload,
    tenant: tenantNonSagwSlug,
    tenantId: tenant.id,
  });

  // re-link fg-admin user to the recreated tenant
  if (process.env.USER_FG_ADMIN_MAIL) {
    const users = await payload.find({
      collection: 'users',
      depth: 0,
      where: {
        email: {
          equals: process.env.USER_FG_ADMIN_MAIL,
        },
      },
    });

    const [fgAdmin] = users.docs;

    if (fgAdmin) {
      await payload.update({
        collection: 'users',
        data: {
          tenants: [
            {
              roles: fgAdmin.tenants?.[0]?.roles || [tenantRoles.admin],
              tenant: tenant.id,
            },
          ],
        },
        id: fgAdmin.id,
        overrideAccess: true,
      });
    }
  }

  payload.logger.info('test-helpers: recreated missing not-sagw tenant');

  return tenant.id;
};

// get's non-sagw tenant. recreates it if a previous test removed it.
export const getTenantNonSagw = (): Promise<string | null> => ensureTenantNonSagw();

export const generateTenant = async ({
  addDefaultTenantData,
  slug,
}: InterfaceGenerateTenantProps): Promise<Tenant> => {
  const payload = await getPayloadCached();

  const tenant = await payload.create({
    collection: 'tenants',
    context: {
      skipTenantInitialData: !addDefaultTenantData,
    },
    data: {
      name: slug,
      slug,
    },
    draft: false,
    overrideAccess: true,
  });

  return tenant;
};

export const getTenantId = async ({
  isSagw,
  time,
}: {
  isSagw: boolean;
  time: number;
}): Promise<string> => {
  let tenant;

  if (isSagw) {
    tenant = (await getTenant()) || '';
  } else {
    const tenantObject = await generateTenant({
      slug: `tenant-${time}`,
    });

    tenant = tenantObject.id;
  }

  return tenant;
};

export const getTenantOfId = async ({
  id,
}: {
  id: string;
}): Promise<any> => {
  const payload = await getPayloadCached();

  const tenant = await payload.findByID({
    collection: 'tenants',
    id,
    locale: 'all',
  });

  return tenant;
};
