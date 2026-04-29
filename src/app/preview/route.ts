// Preview route (preview button in Payload)

import {
  getPayload,
  type PayloadRequest,
} from 'payload';

import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

import configPromise from '@payload-config';
import { routing } from '@/i18n/routing';

export const GET = async (request: NextRequest): Promise<Response> => {
  const payload = await getPayload({
    config: configPromise,
  });

  const {
    searchParams,
  } = new URL(request.url);

  const path = searchParams.get('path');
  const previewSecret = searchParams.get('previewSecret');
  const localeParam = searchParams.get('locale');

  if (previewSecret !== process.env.PREVIEW_SECRET) {
    return new Response('You are not allowed to preview this page', {
      status: 403,
    });
  }

  if (!path) {
    return new Response('Insufficient search params', {
      status: 404,
    });
  }

  if (!path.startsWith('/')) {
    return new Response(
      'This endpoint can only be used for relative previews',
      {
        status: 500,
      },
    );
  }

  let user;

  try {
    user = await payload.auth({
      headers: request.headers,
      req: request as unknown as PayloadRequest,
    });
  } catch (error) {
    payload.logger.error(
      {
        err: error,
      },
      'Error verifying token for live preview',
    );

    return new Response('You are not allowed to preview this page', {
      status: 403,
    });
  }

  const draft = await draftMode();

  if (!user) {
    draft.disable();

    return new Response('You are not allowed to preview this page', {
      status: 403,
    });
  }

  draft.enable();

  const pathname = path.startsWith('/')
    ? path
    : `/${path}`;
  const allowedLocales = routing.locales as readonly string[];
  const resolvedLocale =
    localeParam !== null &&
    localeParam !== '' &&
    allowedLocales.includes(localeParam)
      ? localeParam
      : routing.defaultLocale;

  const destinationPath =
    pathname === '/' || pathname === ''
      ? `/${resolvedLocale}`
      : `/${resolvedLocale}${pathname}`;

  return redirect(destinationPath);
};
