import { InterfacePublicationsListItemPropTypes } from '@/components/base/PublicationsListItem/PublicationsListItem';
import { InterfaceEventsListItemPropTypes } from '@/components/base/EventsListItem/EventsListItem';
import { InterfaceNewsListItemPropTypes } from '@/components/base/NewsListItem/NewsListItem';
import { InterfaceImagePropTypes } from '@/components/base/Image/Image';
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
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { rteToHtml } from '@/utilities/rteToHtml';
import { PaginatedDocs } from 'payload';

export const convertPayloadPublicationsPagesToFeItems = (
  payloadPages: PaginatedDocs<PublicationDetailPage>,
  publicationImages: InterfaceImagePropTypes[],
  lang: Config['locale'],
): InterfacePublicationsListItemPropTypes[] => {
  const items = payloadPages.docs.map((publicationsPage) => {
    let category;

    if (publicationsPage.categorization?.type) {
      category = publicationsPage.categorization.type as PublicationType;
    }

    const index = payloadPages.docs.indexOf(publicationsPage);
    const publicationImage = publicationImages[index];

    const returnPublicationPage: InterfacePublicationsListItemPropTypes = {
      date: formatDateToReadableString({
        dateString: publicationsPage.overviewPageProps.date,
        locale: lang,
      }),
      image: publicationImage,
      link: {
        href: publicationsPage.slug || '',
      },
      tag: category
        ? rteToHtml(category.publicationType)
        : undefined,

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
    const amount = item.relatedPublicationPages?.docs?.length || 0;
    const text = (item as PublicationTopic).publicationTopic || (item as PublicationType).publicationType;

    return {
      checked: false,
      label: `${rte1ToPlaintext(text)} (${amount})`,
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

export const convertPayloadNewsPagesToFeItems = (payloadPages: PaginatedDocs<NewsDetailPage>, lang: Config['locale']): InterfaceNewsListItemPropTypes[] => {
  const items = payloadPages.docs.map((newsPage) => {
    const returnNewsPage: InterfaceNewsListItemPropTypes = {
      date: formatDateToReadableString({
        dateString: newsPage.hero.date,
        locale: lang,
      }),

      // TODO
      link: newsPage.slug || '',

      text: rteToHtml(newsPage.overviewPageProps.teaserText),
      title: rteToHtml(newsPage.hero.title),
    };

    return returnNewsPage;
  });

  return items;
};

interface InterfaceConvertPayloadEventPagesProps {
  payloadPages: EventDetailPage[];
  lang: Config['locale'];
  globalI18n: I18NGlobal;
}

export const convertPayloadEventPagesToFeItems = ({
  payloadPages, globalI18n,
}: InterfaceConvertPayloadEventPagesProps): InterfaceEventsListItemPropTypes[] => {

  const items = payloadPages.map((eventPage) => {
    let category;

    if (eventPage.eventDetails.category) {
      category = eventPage.eventDetails.category as EventCategory;
    }

    // if page has a detail page
    let link = `/${eventPage.slug}`;

    // if page has no detail page
    if (eventPage.showDetailPage === 'false') {
      link = eventPage.link?.externalLink || '';
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

  return items;
};
