import {
  CollectionConfig, CollectionSlug,
} from 'payload';

export interface InterfaceSlug {
  displayName: string;
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
    displayName: 'Home',
    exportName: 'HomePage',
    fileName: 'Home',
    folderName: 'Singletons',
    linkable: true,
    slug: 'homePage',
  },
  {
    displayName: 'Error Page',
    exportName: 'ErrorPage',
    fileName: 'Error',
    folderName: 'Singletons',
    linkable: false,
    slug: 'errorPage',
  },
];

export const setsSlugs: InterfaceSlug[] = [
  {
    displayName: 'Magazine Detail Page',
    exportName: 'MagazineDetailPage',
    fileName: 'MagazineDetail',
    folderName: 'Sets',
    linkable: true,
    slug: 'magazineDetailPage',
  },
  {
    displayName: 'Overview Page',
    exportName: 'OverviewPage',
    fileName: 'Overview',
    folderName: 'Sets',
    linkable: true,
    slug: 'overviewPage',
  },
  {
    displayName: 'Detail Page',
    exportName: 'DetailPage',
    fileName: 'Detail',
    folderName: 'Sets',
    linkable: true,
    slug: 'detailPage',
  },
  {
    displayName: 'Event Detail Page',
    exportName: 'EventDetailPage',
    fileName: 'EventDetail',
    folderName: 'Sets',
    linkable: true,
    slug: 'eventDetailPage',
  },
  {
    displayName: 'News Detail Page',
    exportName: 'NewsDetailPage',
    fileName: 'NewsDetail',
    folderName: 'Sets',
    linkable: true,
    slug: 'newsDetailPage',
  },
  {
    displayName: 'Publication Detail Page',
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
