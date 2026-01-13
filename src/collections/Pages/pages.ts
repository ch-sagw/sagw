import {
  globalCollectionsSlugs, setsSlugs, singletonSlugs,
} from '@/collections/Pages/constants';

const allPages = singletonSlugs.concat(setsSlugs);

export const linkableSlugs = allPages
  .filter((slug) => slug.linkable);

// Extract union type of all linkable collection slugs
export type LinkableCollectionSlug = typeof linkableSlugs[number]['slug'];

export const pagesAndGlobalCollections = allPages.concat(globalCollectionsSlugs);
