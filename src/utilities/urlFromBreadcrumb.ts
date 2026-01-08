import type {
  Config, InterfaceBreadcrumb,
} from '@/payload-types';
import { getBreadcrumbPathSegments } from './getBreadcrumbPathSegments';
import { buildUrlFromPath } from './buildUrlFromPath';

interface InterfaceGeneratePageUrlParams {
  page: {
    slug: Record<string, string>;
    breadcrumb: InterfaceBreadcrumb;
  };
  tenant: string | null;
  locale: Config['locale'];
}

// generates a single url for a page given locale, tenant, breadcrumb
export const urlFromBreadcrumb = ({
  page,
  tenant,
  locale,
}: InterfaceGeneratePageUrlParams): string | undefined => {
  try {
    const slug: string = page.slug[locale];

    if (!slug || typeof slug !== 'string') {
      return undefined;
    }

    // build path from breadcrumb using shared utility
    const {
      breadcrumb,
    } = page;
    const pathSegments = getBreadcrumbPathSegments({
      breadcrumb,
      locale,
    });

    // build final URL using shared utility
    return buildUrlFromPath({
      locale,
      pathSegments,
      slug,
      tenant,
    });
  } catch (error) {
    console.error('Error generating page URL:', error);

    return undefined;
  }
};

