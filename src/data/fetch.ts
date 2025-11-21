import {
  Config, EventDetailPage,
  Team,
} from '@/payload-types';
import configPromise from '@/payload.config';
import {
  CollectionSlug, DataFromCollectionSlug, getPayload,
  Sort,
} from 'payload';

// #########################################################################
// Event Detail pages
// #########################################################################

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

// #########################################################################
// Generic Detail Pages
// #########################################################################

interface InterfaceFetchDetailPagesProps {
  limit?: number;
  language: Config['locale'],
  tenant: string,
  collection: CollectionSlug;
  sort: Sort,
}

export const fetchDetailPages = async ({
  limit,
  language,
  tenant,
  collection,
  sort,
}: InterfaceFetchDetailPagesProps): Promise<DataFromCollectionSlug<CollectionSlug>[]> => {

  const payload = await getPayload({
    config: configPromise,
  });

  const magazinePages = await payload.find({
    collection,
    depth: 0,
    limit,
    locale: language,
    pagination: false,
    sort,
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  return magazinePages.docs;
};

// #########################################################################
// Teams / People
// #########################################################################

interface InterfaceFetchPeopleProps {
  team: string | Team;
  language: Config['locale'];
}

export const fetchTeam = async ({
  team,
  language,
}: InterfaceFetchPeopleProps): Promise<Team | undefined> => {
  let teamId;
  const payload = await getPayload({
    config: configPromise,
  });

  // if team is an object, we can get people from that. if not, we need
  // to fetch the team first
  if (typeof team === 'object') {
    teamId = team.id;
  } else {
    teamId = team;
  }

  if (!teamId) {
    return undefined;
  }

  // collect promises for fetching people
  const fetchedTeam = await payload.findByID({
    collection: 'teams',
    depth: 1,
    id: teamId,
    locale: language,
  });

  if (typeof fetchedTeam === 'object') {
    return fetchedTeam as Team;
  }

  return undefined;

};
