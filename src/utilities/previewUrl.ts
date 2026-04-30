import type { Config } from '@/payload-types';
import type { GeneratePreviewURL } from 'payload';

import {
  getPageUrl,
  HREF_LANG_NO_EXACT_PATH,
} from '@/utilities/getPageUrl';
import { getPayloadCached } from './getPayloadCached';

export type PreviewURLOptions = Parameters<GeneratePreviewURL>[1] & {
  collection: string;
  draft?: boolean;
};

/** Strip locale prefix — `/preview` prepends `/[locale]` when redirecting. */
const pathWithoutLocaleForPreviewRoute = ({
  locale,
  pathname,
}: {
  locale: Config['locale'];
  pathname: string;
}): string => {
  if (pathname === HREF_LANG_NO_EXACT_PATH) {
    return '/';
  }

  const normalized = pathname.startsWith('/')
    ? pathname
    : `/${pathname}`;

  const prefix = `/${locale}`;

  if (
    normalized === prefix ||
    normalized === `${prefix}/`
  ) {
    return '/';
  }

  if (
    normalized.startsWith(`${prefix}/`)
  ) {
    const rest = normalized.slice(prefix.length);

    if (rest === '') {
      return '/';
    }

    return rest;
  }

  return normalized;
};

const previewSlugSegment = (
  slugValue: unknown,
  activeLocale: string | undefined,
): string => {
  if (typeof slugValue === 'string') {
    return slugValue;
  }

  if (
    slugValue !== null &&
    typeof slugValue === 'object' &&
    activeLocale
  ) {
    const value = (
      slugValue as Record<string, unknown>
    )[activeLocale];

    return typeof value === 'string'
      ? value
      : '';
  }

  return '';
};

export const preview = async (
  {
    id,
    slug,
  }: Record<string, unknown>,
  {
    collection,
    draft,
    locale,
  }: PreviewURLOptions,
): Promise<string> => {

  let pageUrl;

  if (draft) {
    const payload = await getPayloadCached();
    const resolvedLocale = locale as Config['locale'];

    let fullPath = await getPageUrl({
      absolute: false,
      locale: resolvedLocale,
      pageId: id as string,
      payload,
      useDraftDocForPath: true,
    });

    if (fullPath === HREF_LANG_NO_EXACT_PATH) {
      const slugSegment = previewSlugSegment(
        slug,
        locale,
      );

      fullPath = slugSegment
        ? `/${resolvedLocale}/${slugSegment}`
        : `/${resolvedLocale}`;
    }

    let pathRelative = pathWithoutLocaleForPreviewRoute({
      locale: resolvedLocale,
      pathname: fullPath,
    });

    if (
      !pathRelative.startsWith('/')
    ) {
      pathRelative = `/${pathRelative}`;
    }

    const encodedParams = new URLSearchParams({
      collection,
      locale: String(locale ?? ''),
      path: pathRelative,
      previewSecret: process.env.PREVIEW_SECRET || '',
    });

    pageUrl = `/preview?${encodedParams.toString()}`;
  } else {
    const payload = await getPayloadCached();

    pageUrl = await getPageUrl({
      locale: locale as Config['locale'],
      pageId: id as string,
      payload,
      usePublishedDocForPath: true,
    });
  }

  return pageUrl;

};
