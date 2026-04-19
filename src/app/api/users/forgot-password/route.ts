import {
  NextRequest, NextResponse,
} from 'next/server';
import { getPayloadCached } from '@/utilities/getPayloadCached';

// Payload's built-in `POST /api/users/forgot-password` lets an attacker
// enumerate admin email addresses via both the response (historically
// 403 when mail-send fails for an existing user vs 200 for an unknown
// one) and — even after the Resend domain is verified — via timing:
// the real path performs DB writes + a Resend API round-trip (~800 ms)
// while the "user not found" branch returns in ~15 ms.
//
// This override wins over `(payload)/api/[...slug]` thanks to Next.js's
// static-over-dynamic route precedence, so we don't need to touch the
// auto-generated `(payload)/` tree.
//
// Strategy:
//   1. Always respond with the same 200 + generic body, regardless of
//      whether the email is present, valid, or belongs to a real user.
//   2. Always await the real work (lookup, token issue, mail send)
//      inline so the email actually sends on every runtime (dev,
//      Vercel). Errors are logged server-side only.
//   3. Pad every response to at least MIN_RESPONSE_MS so "user not
//      found" branches do not resolve measurably faster than real
//      sends.
//
// See SECURITY_FINDINGS.md — Finding B.

const GENERIC_RESPONSE = {
  message: 'If an account exists for that email address, a password reset link has been sent.',
};

// Upper bound of a healthy Resend round-trip as observed locally. Must
// be >= the typical "real send" path so the "user-not-found" branch
// gets padded up to it. Too high is unnecessary UX cost; too low leaks
// timing.
const MIN_RESPONSE_MS = 1_200;

const sleep = (ms: number): Promise<void> => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const respond = (): NextResponse => NextResponse.json(GENERIC_RESPONSE, {
  status: 200,
});

// The admin panel's <Form> posts `multipart/form-data` with the real
// body JSON-stringified inside a `_payload` form field, while
// programmatic / REST callers post `application/json` directly. We
// must accept both shapes so curl-style clients AND the admin UI work.
const extractEmail = async (request: NextRequest): Promise<string | undefined> => {
  const contentType = request.headers.get('content-type') ?? '';

  try {
    if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      const payloadField = formData.get('_payload');

      if (typeof payloadField === 'string') {
        const parsed = JSON.parse(payloadField) as unknown;

        if (parsed && typeof parsed === 'object' && 'email' in parsed && typeof parsed.email === 'string') {
          return parsed.email.trim();
        }
      }

      const directEmail = formData.get('email');

      if (typeof directEmail === 'string') {
        return directEmail.trim();
      }

      return undefined;
    }

    const body = await request.json() as unknown;

    if (body && typeof body === 'object' && 'email' in body && typeof body.email === 'string') {
      return body.email.trim();
    }
  } catch {
    // Malformed body. Caller will respond uniformly.
  }

  return undefined;
};

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const start = Date.now();

  const email = await extractEmail(request);

  // Deliberately do NOT validate email format here — the response must
  // not differ between malformed, nonexistent, and real addresses.
  // Payload's forgotPassword does its own lookup.
  if (email && email.length > 0) {
    try {
      const payload = await getPayloadCached();

      await payload.forgotPassword({
        collection: 'users',
        data: {
          email,
        },
        disableEmail: false,
      });
    } catch (err) {
      try {
        const payload = await getPayloadCached();

        payload.logger.warn({
          email,
          err,
        }, 'forgotPassword failed');
      } catch {
        // Nothing we can do. Do not surface to the client.
      }
    }
  }

  const elapsed = Date.now() - start;

  if (elapsed < MIN_RESPONSE_MS) {
    await sleep(MIN_RESPONSE_MS - elapsed);
  }

  return respond();
};
