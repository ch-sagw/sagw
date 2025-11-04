import 'server-only';
import React, { Fragment } from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import {
  Config, EventCategory, InterfaceHeroField, InterfaceHeroFieldMagazineDetail, InterfaceHeroFieldNewsDetail,
} from '@/payload-types';
import { RenderBlocks } from '@/app/(frontend)/RenderBlocks';
import { getTenant } from '@/app/providers/TenantProvider.server';
import {
  Hero, InterfaceHeroPropTypes,
} from '@/components/global/Hero/Hero';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';

export const revalidate = 0;

// Define the DetailPage collections to search through
const DETAIL_PAGE_COLLECTIONS = [
  'detailPage',
  'overviewPage',
  'newsDetailPage',
  'publicationDetailPage',
  'projectDetailPage',
  'eventDetailPage',
  'instituteDetailPage',
  'magazineDetailPage',
  'nationalDictionaryDetailPage',
] as const;

// Union type of all detail page data types
type DetailPageTypes =
  | Config['collections']['detailPage']
  | Config['collections']['overviewPage']
  | Config['collections']['newsDetailPage']
  | Config['collections']['publicationDetailPage']
  | Config['collections']['projectDetailPage']
  | Config['collections']['eventDetailPage']
  | Config['collections']['instituteDetailPage']
  | Config['collections']['magazineDetailPage']
  | Config['collections']['nationalDictionaryDetailPage'];

export default async function DetailPage({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>
}): Promise<React.JSX.Element> {

  const {
    slug, lang,
  } = await params;

  const language = lang as Config['locale'] || 'de';

  const payload = await getPayload({
    config: configPromise,
  });

  const tenant: string | null = await getTenant();

  if (!tenant) {
    return <p>No tenant data</p>;
  }

  const searchPromises = DETAIL_PAGE_COLLECTIONS.map(async (collection) => {
    try {
      const result = await payload.find({
        collection: collection as any,
        depth: 1,
        limit: 1,
        locale: language,
        // overrideAccess: false,
        where: {
          and: [
            {
              slug: {
                equals: slug,
              },
            },
            {
              tenant: {
                equals: tenant,
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
      // Collection might not exist or have different structure
      return {
        collection,
        error,
        success: false,
      };
    }
  });

  const searchResults = await Promise.allSettled(searchPromises);

  let pageData: DetailPageTypes | null = null;
  let foundCollection: (typeof DETAIL_PAGE_COLLECTIONS)[number] | null = null;

  // Find the first successful result with data
  for (const searchResult of searchResults) {
    if (searchResult.status === 'fulfilled' && searchResult.value.success) {
      const {
        collection,
        result,
      } = searchResult.value;

      if (result && result.docs && result.docs.length > 0) {
        [pageData] = result.docs;
        foundCollection = collection;
        break;
      }
    }
  }

  if (!pageData || !foundCollection) {
    return <p>No page data</p>;
  }

  let heroType: InterfaceHeroPropTypes['type'];
  let heroProps: InterfaceHeroField | InterfaceHeroFieldNewsDetail | InterfaceHeroFieldMagazineDetail | Omit<Extract<InterfaceHeroPropTypes, { type: 'eventDetail' }>, 'type' | 'pageLanguage'> | null = null;

  // Handle different collection types and extract hero data
  if (foundCollection === 'eventDetailPage') {
    const eventPage = pageData as Config['collections']['eventDetailPage'];

    // EventDetailPage doesn't have a hero field
    heroType = 'eventDetail';

    // Extract tag from category
    let tag = '';

    if (eventPage.eventDetails.category) {
      if (typeof eventPage.eventDetails.category === 'object') {
        const category = eventPage.eventDetails.category as EventCategory;

        tag = rte1ToPlaintext(category.eventCategory);
      } else {
        tag = eventPage.eventDetails.category;
      }
    }

    heroProps = {
      colorMode: 'white',
      eventDetails: {
        dateEnd: eventPage.eventDetails.dateEnd || undefined,
        dateStart: eventPage.eventDetails.date,
        eventLocation: eventPage.eventDetails.location
          ? rte1ToPlaintext(eventPage.eventDetails.location)
          : undefined,
        language: eventPage.eventDetails.language
          ? rte1ToPlaintext(eventPage.eventDetails.language)
          : undefined,
        time: eventPage.eventDetails.time || undefined,
      },
      tag,
      title: eventPage.eventDetails.title,
    };
  } else if (foundCollection === 'newsDetailPage') {
    heroType = 'newsDetail';
    const newsPage = pageData as Config['collections']['newsDetailPage'];

    heroProps = newsPage.hero || null;
  } else if (foundCollection === 'magazineDetailPage') {
    heroType = 'magazineDetail';
    const magazinePage = pageData as Config['collections']['magazineDetailPage'];

    heroProps = magazinePage.hero || null;
  } else {
    heroType = 'generic';

    // For other collections, check if they have hero field
    if ('hero' in pageData && pageData.hero) {
      heroProps = pageData.hero;
    }
  }

  // i18n

  const i18nDataDocs = await payload.find({
    collection: 'i18nGlobals',
    depth: 1,
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  if (!i18nDataDocs.docs || i18nDataDocs.docs.length < 1) {
    return <p>No i18n data</p>;
  }

  const [i18nData] = i18nDataDocs.docs;

  // Get content blocks - some pages have content, others have blocks.content
  let contentBlocks = null;

  if ('content' in pageData && pageData.content) {
    contentBlocks = pageData.content;
  } else if ('blocks' in pageData && pageData.blocks && 'content' in pageData.blocks) {
    contentBlocks = pageData.blocks.content;
  }

  return (
    <Fragment>
      <main>
        <div className='detail-page'>
          {heroProps && heroType === 'eventDetail' && (
            <Hero
              {...heroProps as Omit<Extract<InterfaceHeroPropTypes, { type: 'eventDetail' }>, 'type' | 'pageLanguage'>}
              pageLanguage={language}
              type='eventDetail'
            />
          )}
          {heroProps && heroType === 'newsDetail' && (
            <Hero
              {...heroProps as InterfaceHeroFieldNewsDetail}
              pageLanguage={language}
              type='newsDetail'
            />
          )}
          {heroProps && heroType === 'magazineDetail' && (
            <Hero
              {...heroProps as InterfaceHeroFieldMagazineDetail}
              pageLanguage={language}
              type='magazineDetail'
            />
          )}
          {heroProps && heroType === 'generic' && (
            <Hero
              {...heroProps as InterfaceHeroField}
              pageLanguage={language}
              type='generic'
            />
          )}
          {contentBlocks && (
            <RenderBlocks
              blocks={contentBlocks}
              tenantId={tenant}
              pageLanguage={language}
              i18n={i18nData}
            />
          )}
        </div>
      </main>
    </Fragment>
  );
}
