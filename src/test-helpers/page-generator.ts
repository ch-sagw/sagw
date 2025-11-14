/* eslint-disable @typescript-eslint/naming-convention */

import { getPayload } from 'payload';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  DetailPage, EventDetailPage, InstituteDetailPage, MagazineDetailPage, NationalDictionaryDetailPage, NewsDetailPage, OverviewPage,
  ProjectDetailPage,
  PublicationDetailPage,
} from '@/payload-types';

import configPromise from '@/payload.config';
import { getTenant } from '@/app/providers/TenantProvider.server';

interface InterfacePageProps {
  title: string;
  navigationTitle?: string;
  parentPage?: {
    slug: string,
    documentId: string;
  }
}

const generatePage = async ({
  title,
  navigationTitle,
  parentPage,
  type,
}: {
  type: 'overviewPage' | 'detailPage';
} & InterfacePageProps): Promise<OverviewPage | DetailPage> => {
  const tenant = await getTenant();
  const payload = await getPayload({
    config: configPromise,
  });

  if (!tenant) {
    throw new Error('Tenant is not defined.');
  }

  const document = await payload.create({
    collection: type,
    data: {
      _status: 'published',
      hero: {
        colorMode: 'light',
        title: simpleRteConfig(title),
      },
      navigationTitle,
      parentPage,
      tenant,
    },
  });

  return document;
};

export const generateOverviewPage = async (props: InterfacePageProps): Promise<OverviewPage> => (await generatePage({
  ...props,
  type: 'overviewPage',
})) as OverviewPage;

export const generateDetailPage = async (props: InterfacePageProps): Promise<DetailPage> => (await generatePage({
  ...props,
  type: 'detailPage',
})) as DetailPage;

export const generateEventDetailPage = async (props: InterfacePageProps): Promise<EventDetailPage> => {
  const tenant = await getTenant();
  const payload = await getPayload({
    config: configPromise,
  });

  if (!tenant) {
    throw new Error('Tenant is not defined.');
  }

  const project = await payload.create({
    collection: 'projects',
    data: {
      name: simpleRteConfig(`Project ${(new Date())
        .getTime()}`),
      tenant,
    },
    locale: 'de',
  });

  const category = await payload.create({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig(`Category ${(new Date())
        .getTime()}`),
      tenant,
    },
  });

  const document = await payload.create({
    collection: 'eventDetailPage',
    data: {
      _status: 'published',
      eventDetails: {
        category: category.id,
        date: '2030-08-01T12:00:00.000Z',
        dateEnd: '2026-01-01T13:00:00.000Z',
        language: simpleRteConfig('Deutsch'),
        location: simpleRteConfig('ETH Zürich'),
        project: project.id,
        time: '2025-08-31T12:00:00.000Z',
        title: simpleRteConfig(props.title),
      },
      navigationTitle: props.navigationTitle,
      parentPage: props.parentPage,
      showDetailPage: 'true',
      tenant,
    },
  });

  return document;
};

export const generateInstituteDetailPage = async (props: InterfacePageProps): Promise<InstituteDetailPage> => {
  const tenant = await getTenant();
  const payload = await getPayload({
    config: configPromise,
  });

  if (!tenant) {
    throw new Error('Tenant is not defined.');
  }

  const image = await payload.create({
    collection: 'images',
    data: {
      alt: 'image',
      tenant,
    },
    filePath: 'src/seed/test-data/assets/sagw.png',
  });

  const document = await payload.create({
    collection: 'instituteDetailPage',
    data: {
      _status: 'published',
      hero: {
        colorMode: 'light',
        title: simpleRteConfig(props.title),
      },
      navigationTitle: props.navigationTitle,
      overviewPageProps: {
        image: image.id,
        teaserText: simpleRteConfig('some text'),
      },
      parentPage: props.parentPage,
      tenant,
    },
  });

  return document;
};

export const generateMagazineDetailPage = async (props: InterfacePageProps): Promise<MagazineDetailPage> => {
  const tenant = await getTenant();
  const payload = await getPayload({
    config: configPromise,
  });

  if (!tenant) {
    throw new Error('Tenant is not defined.');
  }

  const document = await payload.create({
    collection: 'magazineDetailPage',
    data: {
      _status: 'published',
      hero: {
        author: simpleRteConfig('author'),
        colorMode: 'light',
        date: '2030-08-01T12:00:00.000Z',
        title: simpleRteConfig(props.title),
      },
      navigationTitle: props.navigationTitle,
      overviewPageProps: {
        teaserText: simpleRteConfig('some text'),
      },
      parentPage: props.parentPage,
      tenant,
    },
  });

  return document;
};

export const generateNationalDictionaryDetailPage = async (props: InterfacePageProps): Promise<NationalDictionaryDetailPage> => {
  const tenant = await getTenant();
  const payload = await getPayload({
    config: configPromise,
  });

  if (!tenant) {
    throw new Error('Tenant is not defined.');
  }

  const document = await payload.create({
    collection: 'nationalDictionaryDetailPage',
    data: {
      _status: 'published',
      hero: {
        colorMode: 'light',
        title: simpleRteConfig(props.title),
      },
      navigationTitle: props.navigationTitle,
      overviewPageProps: {
        teaserText: simpleRteConfig('some text'),
      },
      parentPage: props.parentPage,
      tenant,
    },
  });

  return document;
};

export const generateNewsDetailPage = async (props: InterfacePageProps): Promise<NewsDetailPage> => {
  const tenant = await getTenant();
  const payload = await getPayload({
    config: configPromise,
  });

  if (!tenant) {
    throw new Error('Tenant is not defined.');
  }

  const document = await payload.create({
    collection: 'newsDetailPage',
    data: {
      _status: 'published',
      hero: {
        colorMode: 'light',
        date: '2030-08-01T12:00:00.000Z',
        title: simpleRteConfig(props.title),
      },
      navigationTitle: props.navigationTitle,
      overviewPageProps: {
        teaserText: simpleRteConfig('some text'),
      },
      parentPage: props.parentPage,
      tenant,
    },
  });

  return document;
};

export const generateProjectDetailPage = async (props: InterfacePageProps): Promise<ProjectDetailPage> => {
  const tenant = await getTenant();
  const payload = await getPayload({
    config: configPromise,
  });

  if (!tenant) {
    throw new Error('Tenant is not defined.');
  }

  const project = await payload.create({
    collection: 'projects',
    data: {
      name: simpleRteConfig(`Project ${(new Date())
        .getTime()}`),
      tenant,
    },
    locale: 'de',
  });

  const document = await payload.create({
    collection: 'projectDetailPage',
    data: {
      _status: 'published',
      hero: {
        colorMode: 'light',
        title: simpleRteConfig(props.title),
      },
      navigationTitle: props.navigationTitle,
      overviewPageProps: {
        teaserText: simpleRteConfig('some text'),
      },
      parentPage: props.parentPage,
      project: project.id,
      tenant,
    },
  });

  return document;
};

export const generatePublicationDetailPage = async (props: InterfacePageProps): Promise<PublicationDetailPage> => {
  const tenant = await getTenant();
  const payload = await getPayload({
    config: configPromise,
  });

  if (!tenant) {
    throw new Error('Tenant is not defined.');
  }

  const image = await payload.create({
    collection: 'images',
    data: {
      alt: 'image',
      tenant,
    },
    filePath: 'src/seed/test-data/assets/sagw.png',
  });

  const document = await payload.create({
    collection: 'publicationDetailPage',
    data: {
      _status: 'published',
      hero: {
        colorMode: 'light',
        title: simpleRteConfig(props.title),
      },
      navigationTitle: props.navigationTitle,
      overviewPageProps: {
        date: '2030-08-01T12:00:00.000Z',
        image: image.id,
      },
      parentPage: props.parentPage,
      tenant,
    },
  });

  return document;
};
