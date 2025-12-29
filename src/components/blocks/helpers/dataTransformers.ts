import { InterfaceEventsListItemPropTypes } from '@/components/base/EventsListItem/EventsListItem';
import { InterfaceNewsListItemPropTypes } from '@/components/base/NewsListItem/NewsListItem';
import {
  formatDateToReadableString, formatTime,
} from '@/components/helpers/date';
import {
  Config, EventCategory, EventDetailPage, I18NGlobal, NewsDetailPage,
} from '@/payload-types';
import { getPageUrl } from '@/utilities/getPageUrl';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { rteToHtml } from '@/utilities/rteToHtml';
import { PaginatedDocs } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';

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
