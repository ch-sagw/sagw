// plc
import { Users } from '@/collections/Plc/Users';
import { Images } from '@/collections/Plc/Images';
import { Videos } from '@/collections/Plc/Videos';
import { Svgs } from '@/collections/Plc/Svgs';
import { NetworkCategories } from '@/collections/Plc/NetworkCategories';
import { Documents } from '@/collections/Plc/Documents';
import { Projects } from '@/collections/Plc/Projects';
import { People } from '@/collections/Plc/People';
import { PublicationTopics } from '@/collections/Plc/PublicationTopics';
import { PublicationTypes } from '@/collections/Plc/PublicationTypes';
import { EventCategories } from '@/collections/Plc/EventCategories';
import { Departments } from '@/collections/Plc/Departments';
import { ZenodoDocuments } from '@/collections/Plc/ZenodoDocuments';

// Globals
import { I18nForms } from './Globals/i18n/Forms';
import { Consent } from './Globals/Consent';
import { Footer } from './Globals/Footer';
import { Header } from './Globals/Header';
import { StatusMessage } from './Globals/StatusMessage';

// Pages -> Sets
import { MagazineDetailPage } from '@/collections/Pages/Sets/MagazineDetail';
import { OverviewPage } from '@/collections/Pages/Sets/Overview';
import { DetailPage } from '@/collections/Pages/Sets/Detail';
import { EventDetailPage } from './Pages/Sets/EventDetail';
import { NewsDetailPage } from './Pages/Sets/NewsDetail';
import { PublicationDetailPage } from './Pages/Sets/PublicationDetail';

// Pages -> Singletons
import { ErrorPage } from '@/collections/Pages/Singletons/Error';
import { HomePage } from '@/collections/Pages/Singletons/Home';

export const plcCollections = [
  Images,
  Videos,
  Svgs,
  NetworkCategories,
  Documents,
  ZenodoDocuments,
  Projects,
  People,
  PublicationTopics,
  PublicationTypes,
  EventCategories,
  Departments,
  Users,
];

export const singletonPageCollections = [
  HomePage,
  ErrorPage,
];

export const setsPageCollections = [
  OverviewPage,
  DetailPage,
  MagazineDetailPage,
  EventDetailPage,
  NewsDetailPage,
  PublicationDetailPage,
];

export const globalCollections = [
  I18nForms,
  Consent,
  Footer,
  Header,
  StatusMessage,
];

// payload collections config
export const collections = [

  // Pages -> Singletons
  ...singletonPageCollections,

  // Pages -> Sets
  ...setsPageCollections,

  // plc
  ...plcCollections,

  // Globals
  ...globalCollections,

];

// multitenant plugin collections config

// TODO: can we get this interface from somewhere?
export interface InterfaceTenantCollectionObject {
  isGlobal?: boolean;
}

const tenantsCollectionsObject: Record<string, InterfaceTenantCollectionObject> = {};

collections.forEach((item) => {
  if (item.slug !== Departments.slug) {
    if (singletonPageCollections.includes(item) || globalCollections.includes(item)) {
      tenantsCollectionsObject[item.slug] = {
        isGlobal: true,
      };
    } else {
      tenantsCollectionsObject[item.slug] = {};
    }
  }
});

export const tenantsCollections = tenantsCollectionsObject;
