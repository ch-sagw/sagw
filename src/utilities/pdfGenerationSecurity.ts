import 'server-only';
import crypto from 'node:crypto';

const pdfTokenTtlSeconds = 5 * 60;
const localDevPdfSecret = '__local-dev-pdf-generation-secret__';

const getSecret = (): string => {
  if (process.env.PDF_GENERATION_SECRET) {
    return process.env.PDF_GENERATION_SECRET;
  }

  if (process.env.NODE_ENV !== 'production' || process.env.ENV === 'playwright') {
    return localDevPdfSecret;
  }

  return '';
};

const payloadUpdateToken = ({
  expiresAt,
  path,
}: {
  path: string;
  expiresAt: number;
}): string => `${path}:${expiresAt}`;

const createToken = ({
  expiresAt,
  path,
}: {
  path: string;
  expiresAt: number;
}): string => crypto
  .createHmac('sha256', getSecret())
  .update(payloadUpdateToken({
    expiresAt,
    path,
  }))
  .digest('hex');

export const isPdfGenerationEnabled = (): boolean => Boolean(getSecret());

export const createPdfGenerationAuth = ({
  nowSeconds = Math.floor(Date.now() / 1000),
  path,
}: {
  path: string;
  nowSeconds?: number;
}): {
  token: string;
  expiresAt: number;
} | null => {
  if (!isPdfGenerationEnabled()) {
    return null;
  }

  const expiresAt = nowSeconds + pdfTokenTtlSeconds;

  return {
    expiresAt,
    token: createToken({
      expiresAt,
      path,
    }),
  };
};

export const verifyPdfGenerationAuth = ({
  expiresAt,
  nowSeconds = Math.floor(Date.now() / 1000),
  path,
  token,
}: {
  path: string;
  token: string;
  expiresAt: number;
  nowSeconds?: number;
}): boolean => {
  if (!isPdfGenerationEnabled()) {
    return false;
  }

  if (!Number.isFinite(expiresAt) || expiresAt < nowSeconds) {
    return false;
  }

  const expectedToken = createToken({
    expiresAt,
    path,
  });
  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expectedToken);

  if (tokenBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(tokenBuffer, expectedBuffer);
};
