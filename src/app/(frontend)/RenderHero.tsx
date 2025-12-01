'use client';

import {
  InterfaceBreadcrumbItem, InterfaceBreadcrumbPropTypes,
} from '@/components/base/Breadcrumb/Breadcrumb';
import {
  Hero, InterfaceHeroPropTypes,
} from '@/components/global/Hero/Hero';
import {
  Config,
  EventCategory,
  InterfaceHeroField,
  InterfaceHeroFieldMagazineDetail, InterfaceHeroFieldNewsDetail, InterfaceI18NGeneric,
} from '@/payload-types';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import {
  CollectionSlug, TypedLocale,
} from 'payload';
import React from 'react';
import { useTranslations } from 'next-intl';

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

interface InterfaceRenderHero {
  foundCollection: CollectionSlug;
  pageData: PageTypes | null;
  locale: TypedLocale;
  i18nGeneric: InterfaceI18NGeneric;
}

export const RenderHero = ({
  foundCollection,
  pageData,
  locale,
  i18nGeneric,
}: InterfaceRenderHero): React.JSX.Element | undefined => {
  const i18nNavigation = useTranslations('i18nNavigation');

  if (!pageData || !foundCollection) {
    return <p>No page data</p>;
  }

  let heroType: InterfaceHeroPropTypes['type'];
  let heroProps: InterfaceHeroField | InterfaceHeroFieldNewsDetail | InterfaceHeroFieldMagazineDetail | Omit<Extract<InterfaceHeroPropTypes, { type: 'eventDetail' }>, 'type'> | null = null;

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

  // TODO: write generic url generator. it is more complicated than the current
  // implementation. e.g: for each segment, we should fallback to `namede`
  // and `slugde`.
  let breadcrumbItems: InterfaceBreadcrumbItem[] = (pageData.breadcrumb ?? []).reduce<InterfaceBreadcrumbItem[]>((acc, item) => {
    const nameKey = `name${locale}`;
    const slugKey = `slug${locale}`;

    if (nameKey in item && slugKey in item) {
      const text = item[nameKey as keyof typeof item];
      const link = item[slugKey as keyof typeof item];

      if (typeof text === 'string') {

        // just for safety: remove leading and trailing slashes
        const slugSegment = String(link ?? '')
          .replace(/^\/+|\/+$/gu, '');

        if (slugSegment.length > 0) {
          const previousLink = acc.length > 0
            ? acc[acc.length - 1].link
            : '';

          // just for safety: remove trailing slashes
          const base = previousLink.replace(/\/+$/gu, '');
          const nextLink = base.length > 0
            ? `${base}/${slugSegment}`
            : `/${slugSegment}`;

          acc.push({
            link: nextLink,
            text,
          });
        }
      }
    }

    return acc;
  }, []);

  if (breadcrumbItems.length === 0) {
    breadcrumbItems = [
      {
        link: '/',
        text: i18nNavigation('navigationTitleTranslation'),
      },
    ];
  }

  // TODO
  const breadcrumb: InterfaceBreadcrumbPropTypes = {
    colorMode: heroProps.colorMode,
    items: breadcrumbItems,
  };

  if (heroProps && heroType === 'eventDetail') {
    return (
      <Hero
        {...heroProps as Omit<Extract<InterfaceHeroPropTypes, { type: 'eventDetail' }>, 'type'>}
        type='eventDetail'
      />
    );
  } else if (heroProps && heroType === 'newsDetail') {
    return (
      <Hero
        {...heroProps as InterfaceHeroFieldNewsDetail}
        type='newsDetail'
      />
    );
  } else if (heroProps && heroType === 'magazineDetail') {
    return (
      <Hero
        {...heroProps as InterfaceHeroFieldMagazineDetail}
        type='magazineDetail'
        exportArticleText={i18nGeneric.exportArticleButtonText}
      />
    );
  } else if (heroProps && heroType === 'generic') {
    return (
      <Hero
        {...heroProps as InterfaceHeroField}
        type='generic'
        breadcrumb={breadcrumb}
      />
    );
  }

  return undefined;

};
