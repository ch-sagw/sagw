import {
  CollectionSlug, TypedLocale,
} from 'payload';
import { findPageByPath } from '@/app/(frontend)/utilities/findPageByPath';

/** Props Next passes into `[locale]/[...slug]/page` — no app-only fields. */
export type OtherPagesRouteProps = {
  params: Promise<{
    locale: TypedLocale;
    slug: string[];
  }>;
};

export type InterfaceOtherPagesProps = OtherPagesRouteProps & {
  isHome: boolean;
};

export const fetchOtherPagesData = async ({
  isDraftMode,
  locale,
  slugSegments,
  tenantId,
  depth,
}: {
  isDraftMode?: boolean;
  locale: TypedLocale;
  slugSegments: string[];
  tenantId: string;
  depth?: number;
}): Promise<{
  foundCollection: CollectionSlug;
  pageData: any;
} | null> => {
  const pageResult = await findPageByPath({
    depth: depth || 2,
    isDraftMode,
    locale,
    slugSegments,
    tenantId,
  });

  if (!pageResult) {
    return null;
  }

  return {
    foundCollection: pageResult.foundCollection as CollectionSlug,
    pageData: pageResult.pageData,
  };
};
