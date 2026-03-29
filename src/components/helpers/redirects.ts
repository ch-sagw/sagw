import { Redirect } from '@/payload-types';
import { notFound } from 'next/navigation';
import { redirect } from '@/i18n/navigation';
import { getLocaleCodes } from '@/i18n/payloadConfig';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import type { TypedLocale } from 'payload';

interface InterfaceRedirectProps {
  disableNotFound?: boolean;
  locale: TypedLocale;
  url: string;
}

const getRedirects = async (depth = 1): Promise<Redirect[]> => {
  const payload = await getPayloadCached();

  const {
    docs: redirects,
  } = await payload.find({
    collection: 'redirects',
    depth,
    limit: 0,
    pagination: false,
  });

  return redirects;
};

const hrefLocaleFromRedirectTo = (
  to: string,
  fallbackLocale: TypedLocale,
): { href: string; locale: TypedLocale } => {
  const trimmed = to.replace(/^\/+/u, '');
  const segments = trimmed.split('/')
    .filter(Boolean);
  const localeCodes = getLocaleCodes();

  if (
    segments.length > 0 &&
    localeCodes.includes(segments[0] as TypedLocale)
  ) {
    const targetLocale = segments[0] as TypedLocale;
    const pathSegments = segments.slice(1);
    const href = pathSegments.length === 0
      ? '/'
      : `/${pathSegments.join('/')}`;

    return {
      href,
      locale: targetLocale,
    };
  }

  return {
    href: to,
    locale: fallbackLocale,
  };
};

export const Redirector = async ({
  disableNotFound,
  url,
  locale,
}: InterfaceRedirectProps): Promise<null> => {
  const redirects = await getRedirects();

  const redirectItem = redirects.find((redirectEntry) => redirectEntry.from === `${locale}/${url}`);

  if (redirectItem) {
    const {
      href, locale: targetLocale,
    } = hrefLocaleFromRedirectTo(
      redirectItem.to,
      locale,
    );

    return redirect({
      href,
      locale: targetLocale,
    });
  }

  if (disableNotFound) {
    return null;
  }

  return notFound();
};
