import {
  CollectionConfig, CollectionSlug,
} from 'payload';

export interface InterfaceSlug {
  exportName: string;
  fileName: string;
  folderName: string;
  linkable: boolean;
  slug: CollectionSlug;
}

export const getPageImport = async (slugsArray: InterfaceSlug[]): Promise<CollectionConfig[]> => {
  const returnArray = [];

  for await (const slug of slugsArray) {
    const importData = await import(`@/collections/Pages/${slug.folderName}/${slug.fileName}`);

    returnArray.push(importData[slug.exportName]);
  }

  return returnArray;
};

export const singletonSlugs: InterfaceSlug[] = [
  {
    exportName: 'HomePage',
    fileName: 'Home',
    folderName: 'Singletons',
    linkable: true,
    slug: 'homePage',
  },
  {
    exportName: 'ErrorPage',
    fileName: 'Error',
    folderName: 'Singletons',
    linkable: false,
    slug: 'errorPage',
  },
];

export const setsSlugs: InterfaceSlug[] = [
  {
    exportName: 'MagazineDetailPage',
    fileName: 'MagazineDetail',
    folderName: 'Sets',
    linkable: true,
    slug: 'magazineDetailPage',
  },
  {
    exportName: 'OverviewPage',
    fileName: 'Overview',
    folderName: 'Sets',
    linkable: true,
    slug: 'overviewPage',
  },
  {
    exportName: 'DetailPage',
    fileName: 'Detail',
    folderName: 'Sets',
    linkable: true,
    slug: 'detailPage',
  },
  {
    exportName: 'EventDetailPage',
    fileName: 'EventDetail',
    folderName: 'Sets',
    linkable: true,
    slug: 'eventDetailPage',
  },
  {
    exportName: 'NewsDetailPage',
    fileName: 'NewsDetail',
    folderName: 'Sets',
    linkable: true,
    slug: 'newsDetailPage',
  },
  {
    exportName: 'PublicationDetailPage',
    fileName: 'PublicationDetail',
    folderName: 'Sets',
    linkable: true,
    slug: 'publicationDetailPage',
  },
];

export const linkableSlugs = singletonSlugs.concat(setsSlugs)
  .filter((slug) => slug.linkable)
  .map((slug) => slug.slug);
