import type { Config } from '@/payload-types';
import type { GeneratePreviewURL } from 'payload';

import { getPageUrl } from '@/utilities/getPageUrl';
import { getPayloadCached } from './getPayloadCached';

export type PreviewURLOptions = Parameters<GeneratePreviewURL>[1] & {
  collection: string;
  draft?: boolean;
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
    const slugSegment = previewSlugSegment(
      slug,
      locale,
    );

    const encodedParams = new URLSearchParams({
      collection,
      locale: String(locale ?? ''),
      path: `/${slugSegment}`,
      previewSecret: process.env.PREVIEW_SECRET || '',
      slug: slugSegment,
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
