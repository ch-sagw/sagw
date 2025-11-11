import {
  Hero, InterfaceHeroPropTypes,
} from '@/components/global/Hero/Hero';
import {
  Config,
  EventCategory,
  InterfaceHeroField, InterfaceHeroFieldMagazineDetail, InterfaceHeroFieldNewsDetail,
} from '@/payload-types';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { CollectionSlug } from 'payload';
import React from 'react';

// Union type of all detail page data types
type PageTypes =
  | Config['collections']['detailPage']
  | Config['collections']['overviewPage']
  | Config['collections']['newsDetailPage']
  | Config['collections']['publicationDetailPage']
  | Config['collections']['projectDetailPage']
  | Config['collections']['eventDetailPage']
  | Config['collections']['instituteDetailPage']
  | Config['collections']['magazineDetailPage']
  | Config['collections']['nationalDictionaryDetailPage'];

export const RenderHero = ({
  foundCollection,
  pageData,
  language,
}: {
  foundCollection: CollectionSlug;
  pageData: PageTypes | null;
  language: Config['locale']
}): React.JSX.Element | undefined => {

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

  if (!heroProps) {
    return undefined;
  }

  // TODO
  const sampleBreadcrumb = {
    colorMode: heroProps.colorMode,
    items: [
      {
        link: '/',
        text: 'Some nav level 1',
      },
      {
        link: '/',
        text: 'Some nav level 2',
      },
    ],
    pageLanguage: language,
  };

  if (heroProps && heroType === 'eventDetail') {
    return (
      <Hero
        {...heroProps as Omit<Extract<InterfaceHeroPropTypes, { type: 'eventDetail' }>, 'type' | 'pageLanguage'>}
        pageLanguage={language}
        type='eventDetail'
      />
    );
  } else if (heroProps && heroType === 'newsDetail') {
    return (
      <Hero
        {...heroProps as InterfaceHeroFieldNewsDetail}
        pageLanguage={language}
        type='newsDetail'
      />
    );
  } else if (heroProps && heroType === 'magazineDetail') {
    return (
      <Hero
        {...heroProps as InterfaceHeroFieldMagazineDetail}
        pageLanguage={language}
        type='magazineDetail'
      />
    );
  } else if (heroProps && heroType === 'generic') {
    return (
      <Hero
        {...heroProps as InterfaceHeroField}
        pageLanguage={language}
        type='generic'
        breadcrumb={sampleBreadcrumb}
      />
    );
  }

  return undefined;

};
