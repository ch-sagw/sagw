import { InterfaceEventsListItemPropTypes } from '@/components/base/EventsListItem/EventsListItem';
import { InterfaceNewsListItemPropTypes } from '@/components/base/NewsListItem/NewsListItem';
import {
  formatDateToReadableString, formatTime,
} from '@/components/helpers/date';
import {
  Config, EventCategory, EventDetailPage, I18NGlobal, NewsDetailPage,
} from '@/payload-types';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { rteToHtml } from '@/utilities/rteToHtml';
import { PaginatedDocs } from 'payload';

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
  payloadPages: PaginatedDocs<EventDetailPage>;
  lang: Config['locale'];
  globalI18n: I18NGlobal;
}

export const convertPayloadEventPagesToFeItems = ({
  payloadPages, lang, globalI18n,
}: InterfaceConvertPayloadEventPagesProps): InterfaceEventsListItemPropTypes[] => {
  const items = payloadPages.docs.map((eventPage) => {
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
      pageLanguage: lang,
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
