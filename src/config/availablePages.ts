// src/config/availablePages.ts
import type { GlobalSlug } from 'payload';

export const collectionPages = [
  'instituteDetail',
  'magazineDetail',
  'newsDetail',
  'publicationDetail',
] as const;

export const globalPages: GlobalSlug[] = [
  'aboutContact',
  'aboutSagw',
  'aboutTeam',
  'activities',
  'earlyCareerAward',
  'eventsOverview',
  'home',
  'institutes',
  'magazineOverview',
  'network',
  'newsOverview',
  'promotion',
  'publicationsOverview',
];
