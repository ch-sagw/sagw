import {
  CollectionSlug, TypedLocale,
} from 'payload';
import { findPageByPath } from '@/app/(frontend)/utilities/findPageByPath';

export type InterfaceOtherPagesProps = {
  params: Promise<{
    locale: TypedLocale;
    slug: string[];
  }>;
  isHome: boolean;
}

export const fetchOtherPagesData = async ({
  locale,
  slugSegments,
  tenantId,
  depth,
}: {
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
