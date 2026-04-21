import { Tenant } from '@/payload-types';
import { getPayloadCached } from '@/utilities/getPayloadCached';

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

// get's non-sagw tenant
export const getTenantNonSagw = async (): Promise<string | null> => {
  const payload = await getPayloadCached();

  const tenants = await payload.find({
    collection: 'tenants',
    depth: 1,
    where: {
      slug: {
        equals: 'not-sagw',
      },
    },
  });

  if (!tenants.docs || tenants.docs.length < 1) {
    return null;
  }

  return tenants.docs[0].id;
};

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
      faviconName: `favicon-${slug}`,
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
