import {
  Config,
  EventDetailPage,
  MagazineDetailPage,
  NewsDetailPage,
  ProjectDetailPage,
  PublicationDetailPage,
  Team,
} from '@/payload-types';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import {
  BasePayload, CollectionSlug, DataFromCollectionSlug,
  PaginatedDocs,
  Sort, TypedLocale,
  Where,
} from 'payload';

// #########################################################################
// Event Detail pages
// #########################################################################

interface InterfaceFetchEventDetailPagesProps {
  limit?: number;
  language: TypedLocale,
  tenant: string,
  depth?: number;
  payload?: BasePayload;
  project?: string,
}

export const fetchEventDetailPages = async ({
  limit,
  language,
  tenant,
  depth = 1,
  payload: providedPayload,
  project,
}: InterfaceFetchEventDetailPagesProps): Promise<EventDetailPage[]> => {
  const payload = providedPayload || await getPayloadCached();
  const eventPages = await payload.find({
    collection: 'eventDetailPage',
    depth,

    // Fetch all items first, we'll apply limit after filtering
    limit: 0,
    locale: language,
    pagination: false,
    sort: 'eventDetails.date',
    where: {
      /* eslint-disable @typescript-eslint/naming-convention */
      _status: {
      /* eslint-enable @typescript-eslint/naming-convention */
        equals: 'published',
      },
      tenant: {
        equals: tenant,
      },
      ...(project && {
        'eventDetails.project': {
          equals: project,
        },
      }),
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
  if ((limit && limit > 0) && !project) {
    return filteredDocs.slice(0, limit);
  }

  return filteredDocs;
};

// #########################################################################
// Generic Detail Pages
// #########################################################################

interface InterfaceFetchDetailPagesProps {
  depth?: number,
  limit?: number;
  language: Config['locale'],
  tenant: string,
  collection: CollectionSlug;
  sort: Sort,
  payload?: BasePayload;
  projectId?: string,
}

export const fetchDetailPages = async ({
  limit,
  language,
  tenant,
  collection,
  projectId,
  sort,
  depth = 1,
  payload: providedPayload,
}: InterfaceFetchDetailPagesProps): Promise<DataFromCollectionSlug<CollectionSlug>[]> => {
  const payload = providedPayload || await getPayloadCached();

  const queryRestraints: Where = {
    /* eslint-disable @typescript-eslint/naming-convention */
    _status: {
    /* eslint-enable @typescript-eslint/naming-convention */
      equals: 'published',
    },
    tenant: {
      equals: tenant,
    },
    ...(projectId && {
      'categorization.project': {
        equals: projectId,
      },
    }),
  };

  const detailPages = await payload.find({
    collection,
    depth,
    limit: projectId
      ? 0
      : limit,
    locale: language,
    pagination: false,
    sort,
    where: queryRestraints,
  });

  return detailPages.docs;
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
  const payload = await getPayloadCached();

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
    depth: 2,
    id: teamId,
    locale: language,
  });

  if (typeof fetchedTeam === 'object') {
    return fetchedTeam as Team;
  }

  return undefined;

};

// #########################################################################
// News Pages
// #########################################################################

interface InterfaceFetchNewsTeaserPagesProps {
  locale: TypedLocale;
  tenant: string;
  excludePageId?: string;
  depth?: number;
  payload?: BasePayload;
  project?: string,
}

export const fetchNewsTeaserPages = async ({
  locale,
  tenant,
  excludePageId,
  depth = 1,
  payload: providedPayload,
  project,
}: InterfaceFetchNewsTeaserPagesProps): Promise<PaginatedDocs<NewsDetailPage>> => {
  const payload = providedPayload || await getPayloadCached();
  const queryRestraints: Where = {
    tenant: {
      equals: tenant,
    },
    ...(project && {
      project: {
        equals: project,
      },
    }),
  };

  // on news pages, don't show the teaser which points to current page
  if (excludePageId) {
    queryRestraints.id = {
      /* eslint-disable @typescript-eslint/naming-convention */
      not_equals: excludePageId,
      /* eslint-enable @typescript-eslint/naming-convention */
    };
  }

  const results = await payload.find({
    collection: 'newsDetailPage',
    depth,
    limit: project
      ? 0
      : 3,
    locale,
    pagination: false,
    sort: '-hero.date',
    where: queryRestraints,
  });

  return results;
};

interface InterfaceFetchNewsOverviewPagesProps {
  locale: TypedLocale;
  tenant: string;
  depth?: number;
  payload?: BasePayload;
}

export const fetchNewsOverviewPages = async ({
  locale,
  tenant,
  depth = 1,
  payload: providedPayload,
}: InterfaceFetchNewsOverviewPagesProps): Promise<PaginatedDocs<NewsDetailPage>> => {
  const payload = providedPayload || await getPayloadCached();

  return payload.find({
    collection: 'newsDetailPage',
    depth,
    limit: 0,
    locale,
    pagination: false,
    sort: '-hero.date',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });
};

// #########################################################################
// Magazine Pages
// #########################################################################

interface InterfaceFetchMagazinePagesProps {
  locale: TypedLocale;
  tenant: string;
  limit?: number;
  payload?: BasePayload;
}

export const fetchMagazinePages = async ({
  locale,
  tenant,
  limit = 0,
  payload,
}: InterfaceFetchMagazinePagesProps): Promise<MagazineDetailPage[]> => {
  const results = await fetchDetailPages({
    collection: 'magazineDetailPage',
    depth: 1,
    language: locale,
    limit,
    payload,
    sort: '-hero.date',
    tenant,
  });

  return results as MagazineDetailPage[];
};

// #########################################################################
// Projects Pages
// #########################################################################

interface InterfaceFetchProjectsPagesProps {
  locale: TypedLocale;
  tenant: string;
  limit?: number;
  payload?: BasePayload;
}

export const fetchProjectsPages = async ({
  locale,
  tenant,
  limit = 0,
  payload,
}: InterfaceFetchProjectsPagesProps): Promise<ProjectDetailPage[]> => {
  const result = await fetchDetailPages({
    collection: 'projectDetailPage',
    depth: 1,
    language: locale,
    limit,
    payload,
    sort: '-createdAt',
    tenant,
  });

  return result as ProjectDetailPage[];
};

// #########################################################################
// Publication Pages
// #########################################################################

interface InterfaceFetchPublicationPagesProps {
  locale: TypedLocale;
  tenant: string;
  limit?: number;
  payload?: BasePayload;
}

export const fetchPublicationPages = async ({
  locale,
  tenant,
  limit = 0,
  payload,
}: InterfaceFetchPublicationPagesProps): Promise<PublicationDetailPage[]> => {
  const result = await fetchDetailPages({
    collection: 'publicationDetailPage',
    depth: 2,
    language: locale,
    limit,
    payload,
    sort: '-createdAt',
    tenant,
  });

  return result as PublicationDetailPage[];
};
