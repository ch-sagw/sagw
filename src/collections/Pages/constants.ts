import { CollectionSlug } from 'payload';

export interface InterfaceSlug {
  displayName: string;
  exportName: string;
  fileName: string;
  folderName?: string;
  parentFolderName: string;
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
    parentFolderName: 'Pages',
    slug: 'homePage',
  },
  {
    displayName: 'Error Page',
    exportName: 'ErrorPage',
    fileName: 'Error',
    folderName: 'Singletons',
    linkable: false,
    parentFolderName: 'Pages',
    slug: 'errorPage',
  },
  {
    displayName: 'Data Privacy Page',
    exportName: 'DataPrivacyPage',
    fileName: 'DataPrivacy',
    folderName: 'Singletons',
    linkable: true,
    parentFolderName: 'Pages',
    slug: 'dataPrivacyPage',
  },
  {
    displayName: 'Impressum Page',
    exportName: 'ImpressumPage',
    fileName: 'Impressum',
    folderName: 'Singletons',
    linkable: true,
    parentFolderName: 'Pages',
    slug: 'impressumPage',
  },
];

export const setsSlugs: InterfaceSlug[] = [
  {
    displayName: 'Magazine Detail Page',
    exportName: 'MagazineDetailPage',
    fileName: 'MagazineDetail',
    folderName: 'Sets',
    linkable: true,
    parentFolderName: 'Pages',
    slug: 'magazineDetailPage',
  },
  {
    displayName: 'Overview Page',
    exportName: 'OverviewPage',
    fileName: 'Overview',
    folderName: 'Sets',
    linkable: true,
    parentFolderName: 'Pages',
    slug: 'overviewPage',
  },
  {
    displayName: 'Detail Page',
    exportName: 'DetailPage',
    fileName: 'Detail',
    folderName: 'Sets',
    linkable: true,
    parentFolderName: 'Pages',
    slug: 'detailPage',
  },
  {
    displayName: 'Event Detail Page',
    exportName: 'EventDetailPage',
    fileName: 'EventDetail',
    folderName: 'Sets',
    linkable: true,
    parentFolderName: 'Pages',
    slug: 'eventDetailPage',
  },
  {
    displayName: 'News Detail Page',
    exportName: 'NewsDetailPage',
    fileName: 'NewsDetail',
    folderName: 'Sets',
    linkable: true,
    parentFolderName: 'Pages',
    slug: 'newsDetailPage',
  },
  {
    displayName: 'Publication Detail Page',
    exportName: 'PublicationDetailPage',
    fileName: 'PublicationDetail',
    folderName: 'Sets',
    linkable: true,
    parentFolderName: 'Pages',
    slug: 'publicationDetailPage',
  },
  {
    displayName: 'National Dictionary Detail Page',
    exportName: 'NationalDictionaryDetailPage',
    fileName: 'NationalDictionaryDetail',
    folderName: 'Sets',
    linkable: true,
    parentFolderName: 'Pages',
    slug: 'nationalDictionaryDetailPage',
  },
  {
    displayName: 'Institute Detail Page',
    exportName: 'InstituteDetailPage',
    fileName: 'InstituteDetail',
    folderName: 'Sets',
    linkable: true,
    parentFolderName: 'Pages',
    slug: 'instituteDetailPage',
  },
  {
    displayName: 'Project Detail Page',
    exportName: 'ProjectDetailPage',
    fileName: 'ProjectDetail',
    folderName: 'Sets',
    linkable: true,
    parentFolderName: 'Pages',
    slug: 'projectDetailPage',
  },
];

export const globalCollectionsSlugs: InterfaceSlug[] = [
  {
    displayName: 'i18n Globals',
    exportName: 'I18nGlobals',
    fileName: 'Globals',
    folderName: 'i18n',
    linkable: true,
    parentFolderName: 'Globals',
    slug: 'i18nGlobals',
  },
  {
    displayName: 'Consent',
    exportName: 'Consent',
    fileName: 'Consent',
    folderName: undefined,
    linkable: true,
    parentFolderName: 'Globals',
    slug: 'consent',
  },
  {
    displayName: 'Footer',
    exportName: 'Footer',
    fileName: 'Footer',
    folderName: undefined,
    linkable: true,
    parentFolderName: 'Globals',
    slug: 'footer',
  },
  {
    displayName: 'Header',
    exportName: 'Header',
    fileName: 'Header',
    folderName: undefined,
    linkable: true,
    parentFolderName: 'Globals',
    slug: 'header',
  },
  {
    displayName: 'Status Message',
    exportName: 'StatusMessage',
    fileName: 'StatusMessage',
    folderName: undefined,
    linkable: true,
    parentFolderName: 'Globals',
    slug: 'statusMessage',
  },
  {
    displayName: 'Theme',
    exportName: 'Theme',
    fileName: 'Theme',
    folderName: undefined,
    linkable: true,
    parentFolderName: 'Globals',
    slug: 'theme',
  },
];

