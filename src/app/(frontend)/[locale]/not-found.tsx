import 'server-only';
import React from 'react';
import { headers } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';
import { routing } from '@/i18n/routing';
import { RenderNotFoundPage } from '@/app/(frontend)/renderers/RenderNotFoundPage';
import { parsePathAfterLocale } from '@/app/(frontend)/utilities/parsePathAfterLocale';

const pathnameFromHeaders = (headerList: Headers): string => {
  const xPath = headerList.get('x-pathname');

  if (xPath && xPath !== '/') {
    return xPath;
  }

  const xUrl = headerList.get('x-url');

  if (xUrl) {
    try {
      return new URL(xUrl).pathname;
    } catch {
      // we do nothing
    }
  }

  return xPath ?? '/';
};

export default async function NotFound(): Promise<React.JSX.Element> {
  const locale = (await getLocale()) as TypedLocale;
  const headerList = await headers();
  const pathname = pathnameFromHeaders(headerList);
  const slugSegments = parsePathAfterLocale(pathname, routing.locales);

  return (
    <RenderNotFoundPage
      locale={locale}
      slugSegments={slugSegments}
    />
  );
}
