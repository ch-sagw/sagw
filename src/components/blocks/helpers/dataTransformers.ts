import { InterfacePublicationsListItemPropTypes } from '@/components/base/PublicationsListItem/PublicationsListItem';
import { InterfaceEventsListItemPropTypes } from '@/components/base/EventsListItem/EventsListItem';
import { InterfaceNewsListItemPropTypes } from '@/components/base/NewsListItem/NewsListItem';
import {
  formatDateToReadableString, formatTime,
} from '@/components/helpers/date';
import {
  Config,
  EventCategory,
  EventDetailPage,
  I18NGlobal,
  NewsDetailPage,
  PublicationDetailPage,
  PublicationTopic,
  PublicationType,
} from '@/payload-types';
import { InterfaceFilterItem } from '@/components/base/Filter/Filter';
import { getPageUrl } from '@/utilities/getPageUrl';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { rteToHtml } from '@/utilities/rteToHtml';
import { PaginatedDocs } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';

export const convertPayloadPublicationsPagesToFeItems = ({
  lang,
  payloadPages,
  publicationTypes,
  urlMap,
}: {
  lang: Config['locale'];
  payloadPages: PublicationDetailPage[];
  publicationTypes: PublicationType[];
  urlMap: Record<string, string>;
}): InterfacePublicationsListItemPropTypes[] => {

  const items = payloadPages.map((publicationsPage) => {
    let topicId: string | undefined;
    let typeId: string | undefined;
    let tagValue: string | undefined;

    const {
      categorization,
    } = publicationsPage || {};

    if (categorization?.topic) {
      topicId = typeof categorization.topic === 'string'
        ? categorization.topic
        : categorization.topic?.id;
    }

    if (categorization?.type) {
      typeId = typeof categorization.type === 'string'
        ? categorization.type
        : categorization.type?.id;

      if (typeId) {
        const matchedItem = publicationTypes.find((item: PublicationType) => item.id === typeId);

        tagValue = rteToHtml(matchedItem?.publicationType);
      }
    }

    const image = typeof publicationsPage.overviewPageProps.image === 'string'
      ? undefined
      : publicationsPage.overviewPageProps.image;

    const returnPublicationPage: InterfacePublicationsListItemPropTypes = {
      categorization: {
        topic: topicId ?? undefined,
        type: typeId ?? undefined,
      },
      date: formatDateToReadableString({
        dateString: publicationsPage.overviewPageProps.date,
        locale: lang,
      }),
      id: publicationsPage.id,
      image,
      link: {
        href: urlMap[publicationsPage.id],
      },
      tag: tagValue,
      title: rteToHtml(publicationsPage.hero.title),
    };

    return returnPublicationPage;
  });

  return items;
};

interface InterfacePreparePublicationsFilterItems {
  items: PublicationTopic[] | PublicationType[];
  labelAll: string;
}

export const prepareFilterItems = ({
  items,
  labelAll,
}: InterfacePreparePublicationsFilterItems): InterfaceFilterItem[] => {

  const filterItems = items.map((item) => {
    // const amount = item.relatedPublicationPages?.docs?.length || 0;
    const text = (item as PublicationTopic).publicationTopic || (item as PublicationType).publicationType;

    return {
      checked: false,
      label: rte1ToPlaintext(text),
      value: item.id,
    };

  });

  filterItems.unshift({
    checked: true,
    label: labelAll,
    value: 'all',
  });

  return filterItems;
};

export const convertPayloadNewsPagesToFeItems = async (payloadPages: PaginatedDocs<NewsDetailPage>, lang: Config['locale']): Promise<InterfaceNewsListItemPropTypes[]> => {
  const payload = await getPayloadCached();

  const items = payloadPages.docs.map(async (newsPage) => {
    const returnNewsPage: InterfaceNewsListItemPropTypes = {
      date: formatDateToReadableString({
        dateString: newsPage.hero.date,
        locale: lang,
      }),

      // TODO: we need reference tracking here
      link: await getPageUrl({
        locale: lang,
        pageId: newsPage.id,
        payload,
      }),

      text: rteToHtml(newsPage.overviewPageProps.teaserText),
      title: rteToHtml(newsPage.hero.title),
    };

    return returnNewsPage;
  });

  const awaitedItems = await Promise.all(items);

  return awaitedItems;
};

interface InterfaceConvertPayloadEventPagesProps {
  payloadPages: EventDetailPage[];
  lang: Config['locale'];
  globalI18n: I18NGlobal;
}

export const convertPayloadEventPagesToFeItems = async ({
  payloadPages, globalI18n, lang,
}: InterfaceConvertPayloadEventPagesProps): Promise<InterfaceEventsListItemPropTypes[]> => {
  const payload = await getPayloadCached();

  const items = payloadPages.map(async (eventPage) => {
    let category;

    if (eventPage.eventDetails.category) {
      category = eventPage.eventDetails.category as EventCategory;
    }

    let link = '';

    // if page has no detail page
    if (eventPage.showDetailPage === 'false') {
      link = eventPage.link?.externalLink || '';
    } else {

      // TODO: we need reference tracking here
      link = await getPageUrl({
        locale: lang,
        pageId: eventPage.id,
        payload,
      });
    }

    const returnEventPage: InterfaceEventsListItemPropTypes = {
      dateEnd: eventPage.eventDetails.multipleDays
        ? eventPage.eventDetails.dateEnd || eventPage.eventDetails.date
        : eventPage.eventDetails.date,
      dateStart: eventPage.eventDetails.date,
      language: rteToHtml(eventPage.eventDetails.language),
      link: {
        href: link,
        target: eventPage.showDetailPage === 'true'
          ? '_self' as const
          : '_blank' as const,
      },
      location: rteToHtml(eventPage.eventDetails.location),
      tag: category
        ? rteToHtml(category.eventCategory)
        : undefined,
      text: rteToHtml(eventPage.eventDetails.title),
      // time: eventPage.eventDetails.time,
      time: eventPage.eventDetails.time
        ? `${formatTime({
          dateString: eventPage.eventDetails.time,
        })} ${rte1ToPlaintext(globalI18n.generic.time)}`
        : undefined,
    };

    return returnEventPage;
  });

  const awaitedItems = await Promise.all(items);

  return awaitedItems;
};
