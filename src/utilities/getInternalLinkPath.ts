import { TypedLocale } from 'payload';
import { InterfaceInternalLinkValue } from '@/payload-types';

/**
 * Get the stored path for an internal link for a specific locale
 * /{locale}/{tenant?}/{path-to-page}
 *
 * @param internalLink - The internal link value
 * @param locale - Required locale for the path
 */
export const getInternalLinkPath = (
  internalLink: InterfaceInternalLinkValue | undefined | null,
  locale: TypedLocale,
): string => {
  if (!internalLink) {
    return '';
  }

  const pathField = `path${locale}` as 'pathde' | 'pathfr' | 'pathit' | 'pathen';
  const storedPath = internalLink[pathField];

  if (storedPath && typeof storedPath === 'string' && storedPath.trim().length > 0) {
    return storedPath.trim();
  }

  return '';
};
