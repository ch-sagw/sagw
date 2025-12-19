import { getPayloadCached } from '@/utilities/getPayloadCached';

export const getTenant = async (): Promise<string | null> => {
  const payload = await getPayloadCached();

  const tenants = await payload.find({
    collection: 'tenants',
    depth: 1,
    where: {
      name: {
        // TODO: infer tenant from url
        equals: 'sagw',
      },
    },
  });

  if (!tenants.docs || tenants.docs.length < 1) {
    return null;
  }

  return tenants.docs[0].id;
};

