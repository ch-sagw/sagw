import { getPayload } from 'payload';
import configPromise from '@/payload.config';

export const getTenant = async (): Promise<string | null> => {
  const payload = await getPayload({
    config: configPromise,
  });

  const tenants = await payload.find({
    collection: 'tenants',
    depth: 1,
    where: {
      name: {
        // TODO: infer tenant from url
        equals: 'SAGW',
      },
    },
  });

  if (!tenants.docs || tenants.docs.length < 1) {
    return null;
  }

  return tenants.docs[0].id;
};

