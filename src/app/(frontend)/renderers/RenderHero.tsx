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
import { buildBreadcrumbItems } from '@/utilities/buildBreadcrumbItems';
import { buildUrlFromPath } from '@/hooks-payload/computeLinkUrls/buildUrlFromPath';
import {
  CollectionSlug, TypedLocale,
} from 'payload';
import React from 'react';
import { useTranslations } from 'next-intl';
import { CMSConfigError } from '../utilities/CMSConfigError';
import { homeSlug } from '@/collections/constants';

// TODO: refactor
// - get PageTypes from autogeneratePagesIndex
// - derive page types automatically
// - find cleaner approach for heroProps definition

// union type of all detail page data types
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
  const i18nNavigation = useTranslations('navigation');

  if (!pageData || !foundCollection) {
    return <CMSConfigError message='No page data' />;
  }

  let heroType: InterfaceHeroPropTypes['type'];
  let heroProps: InterfaceHeroField | InterfaceHeroFieldNewsDetail | InterfaceHeroFieldMagazineDetail | Omit<Extract<InterfaceHeroPropTypes, { type: 'eventDetail' }>, 'type'> | null = null;

  // handle different collection types and extract hero data
  if (foundCollection === 'eventDetailPage') {
    const eventPage = pageData as Config['collections']['eventDetailPage'];

    // eventDetailPage doesn't have a hero field
    heroType = 'eventDetail';

    // extract tag from category
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

    // for other collections, check if they have hero field
    if ('hero' in pageData && pageData.hero) {
      heroProps = pageData.hero;
    }
  }

  if (!heroProps) {
    return <CMSConfigError message='Hero is misconfigured' />;
  }

  // extract tenant slug from pageData
  const pageDataRecord = pageData as unknown as Record<string, unknown>;
  const tenant = pageDataRecord.tenant as { slug?: Record<string, string> } | { slug?: string } | undefined;
  let tenantSlug: string | null = null;

  if (tenant && typeof tenant === 'object' && tenant.slug) {
    if (typeof tenant.slug === 'object' && locale in tenant.slug) {
      tenantSlug = tenant.slug[locale];
    } else if (typeof tenant.slug === 'string') {
      tenantSlug = tenant.slug;
    }
    tenantSlug = tenantSlug || null;
  }

  // build breadcrumb items
  let breadcrumbItems: InterfaceBreadcrumbItem[] = buildBreadcrumbItems({
    breadcrumb: pageData.breadcrumb ?? [],
    locale,
    tenant: tenantSlug,
  });

  // fallback
  if (breadcrumbItems.length === 0) {
    const homeUrl = buildUrlFromPath({
      locale,
      pathSegments: [],
      slug: homeSlug,
      tenant: tenantSlug,
    });

    breadcrumbItems = [
      {
        link: homeUrl,
        text: i18nNavigation('navigationTitle'),
      },
    ];
  }

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
