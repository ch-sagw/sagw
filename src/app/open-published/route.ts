import {
  draftMode,
  headers as nextHeaders,
} from 'next/headers';
import {
  NextRequest,
  NextResponse,
} from 'next/server';
import {
  type CollectionSlug,
  getPayload,
  type PayloadRequest,
} from 'payload';

import configPromise from '@/payload.config';
import type { Config } from '@/payload-types';
import { pageCollectionSlugsWithSiteUrl } from '@/collections/Pages/constants';
import { getLocaleCodes } from '@/i18n/payloadConfig';
import {
  preview,
  type PreviewURLOptions,
} from '@/utilities/previewUrl';

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

// published URL for this document (preview, draft: false),
// then clears Next Draft Mode and redirects:
// `GET /open-published?collection=&id=&locale=`
export const GET = async (request: NextRequest): Promise<Response> => {
  const payload = await getPayload({
    config: configPromise,
  });

  const reqHeaders = await nextHeaders();
  const {
    user,
  } = await payload.auth({
    headers: reqHeaders,
  });

  if (!user) {
    return NextResponse.json({
      error: 'Unauthorized',
    }, {
      status: 401,
    });
  }

  const collectionParam = request.nextUrl.searchParams.get('collection');
  const idParam = request.nextUrl.searchParams.get('id');
  const localeParam = request.nextUrl.searchParams.get('locale');

  const allowedLocales = getLocaleCodes() as Config['locale'][];

  if (
    typeof collectionParam !== 'string' ||
    !pageCollectionSlugsWithSiteUrl.includes(collectionParam as CollectionSlug)
  ) {
    return NextResponse.json({
      error: 'Invalid payload',
    }, {
      status: 400,
    });
  }

  if (
    idParam === null ||
    idParam.length === 0
  ) {
    return NextResponse.json({
      error: 'Missing document id',
    }, {
      status: 400,
    });
  }

  if (
    typeof localeParam !== 'string' ||
    !allowedLocales.includes(localeParam as Config['locale'])
  ) {
    return NextResponse.json({
      error: 'Invalid locale',
    }, {
      status: 400,
    });
  }

  const collection = collectionParam;
  const locale = localeParam as Config['locale'];

  const pageUrl = await preview(
    {
      id: idParam,
    },
    {
      collection,
      draft: false,
      locale,
      req: request as unknown as PayloadRequest,
      token: null,
    } as PreviewURLOptions,
  );

  const draft = await draftMode();

  draft.disable();

  const destination = pageUrl.startsWith('http')
    ? pageUrl
    : new URL(
      pageUrl,
      request.nextUrl.origin,
    ).href;

  return NextResponse.redirect(destination);
};
