import {
  Config, EventDetailPage,
} from '@/payload-types';
import configPromise from '@/payload.config';
import { getPayload } from 'payload';

interface InterfaceFetchEventDetailPagesProps {
  limit?: number;
  language: Config['locale'],
  tenant: string,
}

export const fetchEventDetailPages = async ({
  limit,
  language,
  tenant,
}: InterfaceFetchEventDetailPagesProps): Promise<EventDetailPage[]> => {

  const payload = await getPayload({
    config: configPromise,
  });

  const eventPages = await payload.find({
    collection: 'eventDetailPage',
    depth: 1,

    // Fetch all items first, we'll apply limit after filtering
    limit: 0,
    locale: language,
    pagination: false,
    sort: 'eventDetails.date',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  // Filter out events older than yesterday
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(23, 59, 59, 999);

  const filteredDocs = eventPages.docs.filter((eventPage) => {
    const eventDate = new Date(eventPage.eventDetails.date);

    return eventDate > yesterday;
  });

  // Apply limit if specified and greater than 0
  if (limit && limit > 0) {
    return filteredDocs.slice(0, limit);
  }

  return filteredDocs;
};
