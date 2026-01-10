import { Tenant } from '@/payload-types';
import { getPayloadCached } from '@/utilities/getPayloadCached';

interface InterfaceGenerateTenantProps {
  name: string;
}

// get's default sagw tenant
export const getTenant = async (): Promise<string | null> => {
  const payload = await getPayloadCached();

  const tenants = await payload.find({
    collection: 'tenants',
    depth: 1,
    where: {
      name: {
        equals: 'sagw',
      },
    },
  });

  console.log('####### TENANTS');
  console.log(tenants.docs);

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
      name: {
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
  name,
}: InterfaceGenerateTenantProps): Promise<Tenant> => {
  const payload = await getPayloadCached();

  const tenant = await payload.create({
    collection: 'tenants',
    data: {
      name,
      slug: name,
      title: name,
    },
    draft: false,
    overrideAccess: true,
  });

  await payload.update({
    collection: 'tenants',
    data: {
      ...tenant,
      slug: `${name}-fr`,
    },
    id: tenant.id,
    locale: 'fr',
  });

  await payload.update({
    collection: 'tenants',
    data: {
      ...tenant,
      slug: `${name}-en`,
    },
    id: tenant.id,
    locale: 'en',
  });

  await payload.update({
    collection: 'tenants',
    data: {
      ...tenant,
      slug: `${name}-it`,
    },
    id: tenant.id,
    locale: 'it',
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
      name: `tenant-${time}`,
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
