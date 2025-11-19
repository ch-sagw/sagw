import {
  Config, EventDetailPage,
  MagazineDetailPage,
  ProjectDetailPage,
} from '@/payload-types';
import configPromise from '@/payload.config';
import { getPayload } from 'payload';

interface InterfaceFetchDetailPagesProps {
  limit?: number;
  language: Config['locale'],
  tenant: string,
}

export const fetchEventDetailPages = async ({
  limit,
  language,
  tenant,
}: InterfaceFetchDetailPagesProps): Promise<EventDetailPage[]> => {

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

export const fetchProjectDetailPages = async ({
  limit,
  language,
  tenant,
}: InterfaceFetchDetailPagesProps): Promise<ProjectDetailPage[]> => {

  const payload = await getPayload({
    config: configPromise,
  });

  const projectPages = await payload.find({
    collection: 'projectDetailPage',
    depth: 0,
    limit,
    locale: language,
    pagination: false,
    sort: 'createdAt',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  return projectPages.docs;
};

export const fetchMagazineDetailPages = async ({
  limit,
  language,
  tenant,
}: InterfaceFetchDetailPagesProps): Promise<MagazineDetailPage[]> => {

  const payload = await getPayload({
    config: configPromise,
  });

  const magazinePages = await payload.find({
    collection: 'magazineDetailPage',
    depth: 0,
    limit,
    locale: language,
    pagination: false,
    sort: 'createdAt',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  return magazinePages.docs;
};
