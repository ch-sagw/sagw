import type {
  InterfaceInternalLinkUrls, InterfaceInternalLinkValue,
} from '@/payload-types';
import type { TypedLocale } from 'payload';

interface InterfaceGetInternalLinkHrefParams {
  internalLink: InterfaceInternalLinkValue & {
    url?: InterfaceInternalLinkUrls;
  };
  locale: TypedLocale;
}

/**
 * Gets the href for an internal link given the locale
 * Uses the URL from the internalLink.url which should be populated by
 * beforeValidate hooks.
 * Falls back to generating from slug/documentId if URL is not present
 */
export const getInternalLinkHref = ({
  internalLink,
  locale,
}: InterfaceGetInternalLinkHrefParams): string => {
  // URL should always be present as it's added by beforeValidate hooks
  if (internalLink.url) {
    const url = internalLink.url[locale as keyof typeof internalLink.url];

    if (url) {
      return url;
    }
  }

  // Fallback: generate from slug/documentId
  // This should rarely happen if hooks are working correctly
  return `/${internalLink.slug}/${internalLink.documentId}`;
};
