import { cache } from 'react';
import { getPayload } from 'payload';

// Lazy config import: static import creates cycles
// via collections -> hooks -> `@/data/fetch` -> here.
export const getPayloadCached = cache(async () => {
  const {
    default: config,
  } = await import('@/payload.config');
  const payloadInstance = await getPayload({
    config,
  });

  return payloadInstance;
});
