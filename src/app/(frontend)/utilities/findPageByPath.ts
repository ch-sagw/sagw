import 'server-only';
import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { singletonSlugs } from '@/collections/Pages/constants';

// TODO: get from const
// Define the DetailPage collections to search through
const PAGE_COLLECTIONS = [
  'detailPage',
  'overviewPage',
  'newsDetailPage',
  'publicationDetailPage',
  'projectDetailPage',
  'eventDetailPage',
  'instituteDetailPage',
  'magazineDetailPage',
  'nationalDictionaryDetailPage',
  'impressumPage',
  'dataPrivacyPage',
] as const;

type InterfaceFindPageByPathResult = {
  pageData: any;
  foundCollection: (typeof PAGE_COLLECTIONS)[number];
} | null;

interface InterfaceFindPageByPathParams {
  slugSegments: string[];
  tenantId: string;
  locale: TypedLocale;
  depth?: number;
}

// searches for pages by last slug segment only.
// handles nested paths by extracting all segments, using last one for lookup.
// returns page data and collection type for the given tenant.

export const findPageByPath = async ({
  slugSegments,
  tenantId,
  locale,
  depth,
}: InterfaceFindPageByPathParams): Promise<InterfaceFindPageByPathResult> => {
  if (slugSegments.length === 0) {
    return null;
  }

  const payload = await getPayloadCached();
  const lastSlug = slugSegments[slugSegments.length - 1];

  // Separate singleton collections from regular collections
  const singletonCollectionSlugs = singletonSlugs.map((s) => s.slug);
  const regularCollections = PAGE_COLLECTIONS.filter((collection) => !singletonCollectionSlugs.includes(collection as any));
  const singletonCollections = PAGE_COLLECTIONS.filter((collection) => singletonCollectionSlugs.includes(collection as any));

  // Handle regular collections
  const regularSearchPromises = regularCollections.map(async (collection) => {
    try {
      const result = await payload.find({
        collection: collection as any,
        depth: depth || 1,
        limit: 1,
        locale,
        where: {
          and: [
            {
              slug: {
                equals: lastSlug,
              },
            },
            {
              tenant: {
                equals: tenantId,
              },
            },
          ],
        },
      });

      return {
        collection,
        result,
        success: true,
      };
    } catch (error) {
      // collection might not exist or have different structure
      return {
        collection,
        error,
        success: false,
      };
    }
  });

  // handle singleton collections differently
  // fetch without slug filter, then check slug after hook runs
  const singletonSearchPromises = singletonCollections.map(async (collection) => {
    try {
      // for singletons, fetch without slug filter
      // since slug is generated in afterRead hook
      const result = await payload.find({
        collection: collection as any,
        depth: 1,
        limit: 1,
        locale,
        where: {
          tenant: {
            equals: tenantId,
          },
        },
      });

      // check if any document's slug (after hook) matches
      if (result.docs && result.docs.length > 0) {
        const [doc] = result.docs;

        // the slug should now be populated by afterRead hook
        if (doc.slug === lastSlug) {
          return {
            collection,
            result: {
              ...result,
              docs: [doc],
            },
            success: true,
          };
        }
      }

      return {
        collection,
        result: {
          ...result,
          docs: [],
        },
        success: true,
      };
    } catch (error) {
      return {
        collection,
        error,
        success: false,
      };
    }
  });

  const allSearchPromises = [
    ...regularSearchPromises,
    ...singletonSearchPromises,
  ];
  const searchResults = await Promise.allSettled(allSearchPromises);

  // find the first successful result with data
  for (const searchResult of searchResults) {
    if (searchResult.status === 'fulfilled' && searchResult.value.success) {
      const {
        collection,
        result,
      } = searchResult.value;

      if (result && result.docs && result.docs.length > 0) {
        return {
          foundCollection: collection,
          pageData: result.docs[0],
        };
      }
    }
  }

  return null;
};

