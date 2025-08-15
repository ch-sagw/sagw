// plc
import { Users } from '@/collections/Users';
import { Images } from '@/collections/Images';
import { Videos } from '@/collections/Videos';
import { NetworkCategories } from '@/collections/NetworkCategories';
import { FaqItems } from '@/collections/FaqItems';
import { Documents } from '@/collections/Documents';
import { Projects } from '@/collections/Projects';
import { People } from '@/collections/People';
import { PublicationTopics } from '@/collections/PublicationTopics';
import { PublicationTypes } from '@/collections/PublicationTypes';
import { EventCategories } from '@/collections/EventCategories';
import { Events } from '@/collections/Events';
import { Departments } from '@/collections/Departments';

// Globals
import { I18nForms } from './Globals/i18n/Forms';
import { I18nGlobal } from './Globals/i18n/Globals';
import { Consent } from './Globals/Consent';
import { Footer } from './Globals/Footer';
import { Header } from './Globals/Header';
import { StatusMessage } from './Globals/StatusMessage';

// Pages -> Sets
import { InstituteDetailPage } from '@/collections/Pages/Sets/InstituteDetail';
import { MagazineDetailPage } from '@/collections/Pages/Sets/MagazineDetail';
import { PublicationDetailPage } from '@/collections/Pages/Sets/PublicationDetail';
import { NewsDetailPage } from '@/collections/Pages/Sets/NewsDetail';

// Pages -> Singletons
import { AboutContactPage } from '@/collections/Pages/Singletons/About/Contact';
import { AboutSagwPage } from '@/collections/Pages/Singletons/About/Sagw';
import { AboutTeamPage } from '@/collections/Pages/Singletons/About/Team';
import { ActivitiesPage } from '@/collections/Pages/Singletons/Activities/Activities';
import { EventsOverviewPage } from '@/collections/Pages/Singletons/Activities/EventsOverview';
import { MagazineOverviewPage } from '@/collections/Pages/Singletons/Activities/MagazineOverview';
import { NewsOverviewPage } from '@/collections/Pages/Singletons/Activities/NewsOverview';
import { PublicationsOverviewPage } from '@/collections/Pages/Singletons/Activities/PublicationsOverview';
import { EarlyCareerAwardPage } from '@/collections/Pages/Singletons/Promotion/EarlyCareerAward';
import { InstitutesPage } from '@/collections/Pages/Singletons/Promotion/Institutes';
import { PromotionPage } from '@/collections/Pages/Singletons/Promotion/Promotion';
import { ErrorPage } from '@/collections/Pages/Singletons/ErrorPage';
import { HomePage } from '@/collections/Pages/Singletons/HomePage';
import { NetworkPage } from '@/collections/Pages/Singletons/NetworkPage';

export const plcCollections = [
  Departments,
  Users,
  Images,
  NetworkCategories,
  FaqItems,
  Documents,
  Projects,
  People,
  Videos,
  PublicationTopics,
  PublicationTypes,
  Events,
  EventCategories,
];

export const singletonPageCollections = [
  AboutContactPage,
  AboutSagwPage,
  AboutTeamPage,
  ActivitiesPage,
  EventsOverviewPage,
  MagazineOverviewPage,
  NewsOverviewPage,
  PublicationsOverviewPage,
  EarlyCareerAwardPage,
  InstitutesPage,
  PromotionPage,
  ErrorPage,
  HomePage,
  NetworkPage,
];

export const setsPageCollections = [
  InstituteDetailPage,
  MagazineDetailPage,
  PublicationDetailPage,
  NewsDetailPage,
];

export const globalCollections = [
  I18nForms,
  I18nGlobal,
  Consent,
  Footer,
  Header,
  StatusMessage,
];

// payload collections config
export const collections = [

  // plc
  ...plcCollections,

  // Pages -> Singletons
  ...singletonPageCollections,

  // Pages -> Sets
  ...setsPageCollections,

  // Globals
  ...globalCollections,

];

// multitenant plugin collections config

// TODO: can we get this interface from somewhere?
interface InterfaceTenantCollectionObject {
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
