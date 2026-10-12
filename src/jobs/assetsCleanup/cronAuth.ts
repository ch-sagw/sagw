import crypto from 'node:crypto';

// ########################################################################
// Authentication of cron requests
//
// Vercel cron requests (and our GitHub Action for the test environment)
// send `Authorization: Bearer <CRON_SECRET>`. Outside of production
// builds (local dev server, playwright) a fixed fallback secret is used so
// the endpoint can be tested automatically.
// ########################################################################

export const localDevCronSecret = '__local-dev-cron-secret__';

export const getCronSecret = (): string => {
  if (process.env.CRON_SECRET) {
    return process.env.CRON_SECRET;
  }

  if (process.env.NODE_ENV !== 'production' || process.env.ENV === 'playwright') {
    return localDevCronSecret;
  }

  return '';
};

const safeEqual = (a: string, b: string): boolean => {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
};

export const isCronRequestAuthorized = (headers: Headers): boolean => {
  const secret = getCronSecret();

  if (!secret) {
    return false;
  }

  const authHeader = headers.get('authorization') || '';

  return safeEqual(authHeader, `Bearer ${secret}`);
};
