import { CollectionSlug } from 'payload';

export interface InterfaceSlug {
  displayName: string;
  exportName: string;
  fileName: string;
  folderName: string;
  linkable: boolean;
  slug: CollectionSlug;
}

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
  {
    displayName: 'Data Privacy Page',
    exportName: 'DataPrivacyPage',
    fileName: 'DataPrivacy',
    folderName: 'Singletons',
    linkable: true,
    slug: 'dataPrivacyPage',
  },
  {
    displayName: 'Impressum Page',
    exportName: 'ImpressumPage',
    fileName: 'Impressum',
    folderName: 'Singletons',
    linkable: true,
    slug: 'impressumPage',
  },
];

const setsSlugs: InterfaceSlug[] = [
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
  {
    displayName: 'National Dictionary Detail Page',
    exportName: 'NationalDictionaryDetailPage',
    fileName: 'NationalDictionaryDetail',
    folderName: 'Sets',
    linkable: true,
    slug: 'nationalDictionaryDetailPage',
  },
  {
    displayName: 'Institute Detail Page',
    exportName: 'InstituteDetailPage',
    fileName: 'InstituteDetail',
    folderName: 'Sets',
    linkable: true,
    slug: 'instituteDetailPage',
  },
  {
    displayName: 'Project Detail Page',
    exportName: 'ProjectDetailPage',
    fileName: 'ProjectDetail',
    folderName: 'Sets',
    linkable: true,
    slug: 'projectDetailPage',
  },
];

export const allPages = singletonSlugs.concat(setsSlugs);

export const linkableSlugs = allPages
  .filter((slug) => slug.linkable);

// Extract union type of all linkable collection slugs
export type LinkableCollectionSlug = typeof linkableSlugs[number]['slug'];
