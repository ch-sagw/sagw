import { getPayload } from 'payload';
import configPromise from '@/payload.config';

// TODO: infer department from url
export const getTenant = async (): Promise<string | null> => {
  const payload = await getPayload({
    config: configPromise,
  });

  const tenants = await payload.find({
    collection: 'departments',
    depth: 1,
    where: {
      name: {
        equals: 'SAGW',
      },
    },
  });

  if (!tenants.docs || tenants.docs.length < 1) {
    return null;
  }

  return tenants.docs[0].id;
};

