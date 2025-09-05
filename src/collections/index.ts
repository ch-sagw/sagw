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
import { Forms } from '@/collections/Plc/Forms';

// Globals
import { I18nForms } from './Globals/i18n/Forms';
import { Consent } from './Globals/Consent';
import { Footer } from './Globals/Footer';
import { Header } from './Globals/Header';
import { StatusMessage } from './Globals/StatusMessage';
import { CollectionConfig } from 'payload';
import {
  getPageImport, setsSlugs, singletonSlugs,
} from '@/collections/Pages';

// we want to define page slugs once. using the exported collections from this
// file would not work if we would like to import the collections into a block
// or collection -> circular reference or more specific, the collections would
// not be defined yet at the time of importing them into a block. That's why
// we do it this way.

// Pages -> Sets & Singletons
const singletonPageCollections: CollectionConfig[] = await getPageImport(singletonSlugs);
const setsPageCollections: CollectionConfig[] = await getPageImport(setsSlugs);

export const plcCollections: CollectionConfig[] = [
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
  Forms,
];

export const globalCollections: CollectionConfig[] = [
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

// manually add forms. this is an automatically generated collection by the
// form builder plugin, so we don't manually add it to collections above.
tenantsCollectionsObject['forms'] = {};

export const tenantsCollections = tenantsCollectionsObject;
