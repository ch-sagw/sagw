import { cache } from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

export const getPayloadCached = cache(async () => {
  const payloadInstance = await getPayload({
    config: configPromise,
  });

  return payloadInstance;
});
