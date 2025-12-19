/* eslint-disable @typescript-eslint/naming-convention */

import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  Config as ConfigFromTypes, DetailPage, EventDetailPage, HomePage, InstituteDetailPage, MagazineDetailPage, NationalDictionaryDetailPage, NewsDetailPage,
  OverviewPage,
  ProjectDetailPage,
  PublicationDetailPage,
} from '@/payload-types';

import { getTenant } from '@/app/providers/TenantProvider.server';
import slugify from 'slugify';
import { getPayloadCached } from '@/utilities/getPayloadCached';

interface InterfacePageProps {
  title: string;
  navigationTitle?: string;
  parentPage?: {
    slug: string,
    documentId: string;
  };
  tenant?: string;
  locale?: ConfigFromTypes['locale'];
  content?: any[];
  draft?: boolean;
}

const generatePage = async ({
  title,
  navigationTitle,
  parentPage,
  type,
  tenant: propsTenant,
  locale,
  content,
  draft,
}: {
  type: 'overviewPage' | 'detailPage';
} & InterfacePageProps): Promise<OverviewPage | DetailPage> => {
  let tenant;

  if (propsTenant) {
    tenant = propsTenant;
  } else {
    tenant = await getTenant();
  }

  const payload = await getPayloadCached();

  if (!tenant) {
    throw new Error('Tenant is not defined.');
  }

  const document = await payload.create({
    collection: type,
    data: {
      _status: draft
        ? 'draft'
        : 'published',
      content,
      hero: {
        colorMode: 'light',
        title: simpleRteConfig(title),
      },
      navigationTitle,
      parentPage,
      slug: slugify(title, {
        lower: true,
        strict: true,
        trim: true,
      }),
      tenant,
    },
    draft: false,
    locale: locale || 'de',
  });

  return document;
};

interface InterfaceGenerateHomePageProps {
  title: string;
  navigationTitle?: string;
  sideTitle: string;
  tenant?: string;
  locale?: ConfigFromTypes['locale'];
}

export const generateHomePage = async ({
  title,
  sideTitle,
  tenant: propsTenant,
  locale,
}: InterfaceGenerateHomePageProps): Promise<HomePage> => {
  const payload = await getPayloadCached();

  let tenant;

  if (propsTenant) {
    tenant = propsTenant;
  } else {
    tenant = await getTenant();
  }

  const homePage = await payload.create({
    collection: 'homePage',
    data: {
      hero: {
        sideTitle: simpleRteConfig(sideTitle),
        title: simpleRteConfig(title),
      },
      tenant,
    },
    locale: locale || 'de',
  });

  return homePage;
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
  let tenant;

  if (props.tenant) {
    // eslint-disable-next-line prefer-destructuring
    tenant = props.tenant;
  } else {
    tenant = await getTenant();
  }

  const payload = await getPayloadCached();

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
    locale: props.locale || 'de',
  });

  const category = await payload.create({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig(`Category ${(new Date())
        .getTime()}`),
      tenant,
    },
    locale: props.locale || 'de',
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
      slug: slugify(props.title, {
        lower: true,
        strict: true,
        trim: true,
      }),
      tenant,
    },
    draft: false,
    locale: props.locale || 'de',
  });

  return document;
};

export const generateInstituteDetailPage = async (props: InterfacePageProps): Promise<InstituteDetailPage> => {
  let tenant;

  if (props.tenant) {
    // eslint-disable-next-line prefer-destructuring
    tenant = props.tenant;
  } else {
    tenant = await getTenant();
  }

  const payload = await getPayloadCached();

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
    locale: props.locale || 'de',
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
      slug: slugify(props.title, {
        lower: true,
        strict: true,
        trim: true,
      }),
      tenant,
    },
    draft: false,
    locale: props.locale || 'de',
  });

  return document;
};

export const generateMagazineDetailPage = async (props: InterfacePageProps): Promise<MagazineDetailPage> => {
  let tenant;

  if (props.tenant) {
    // eslint-disable-next-line prefer-destructuring
    tenant = props.tenant;
  } else {
    tenant = await getTenant();
  }

  const payload = await getPayloadCached();

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
      slug: slugify(props.title, {
        lower: true,
        strict: true,
        trim: true,
      }),
      tenant,
    },
    draft: false,
    locale: props.locale || 'de',
  });

  return document;
};

export const generateNationalDictionaryDetailPage = async (props: InterfacePageProps): Promise<NationalDictionaryDetailPage> => {
  let tenant;

  if (props.tenant) {
    // eslint-disable-next-line prefer-destructuring
    tenant = props.tenant;
  } else {
    tenant = await getTenant();
  }

  const payload = await getPayloadCached();

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
      slug: slugify(props.title, {
        lower: true,
        strict: true,
        trim: true,
      }),
      tenant,
    },
    draft: false,
    locale: props.locale || 'de',
  });

  return document;
};

export const generateNewsDetailPage = async (props: InterfacePageProps): Promise<NewsDetailPage> => {
  let tenant;

  if (props.tenant) {
    // eslint-disable-next-line prefer-destructuring
    tenant = props.tenant;
  } else {
    tenant = await getTenant();
  }

  const payload = await getPayloadCached();

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
      slug: slugify(props.title, {
        lower: true,
        strict: true,
        trim: true,
      }),
      tenant,
    },
    draft: false,
    locale: props.locale || 'de',
  });

  return document;
};

export const generateProjectDetailPage = async (props: InterfacePageProps): Promise<ProjectDetailPage> => {
  let tenant;

  if (props.tenant) {
    // eslint-disable-next-line prefer-destructuring
    tenant = props.tenant;
  } else {
    tenant = await getTenant();
  }

  const payload = await getPayloadCached();

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
        linkText: simpleRteConfig('some text'),
        teaserText: simpleRteConfig('some text'),
      },
      parentPage: props.parentPage,
      project: project.id,
      slug: slugify(props.title, {
        lower: true,
        strict: true,
        trim: true,
      }),
      tenant,
    },
    draft: false,
    locale: props.locale || 'de',
  });

  return document;
};

export const generatePublicationDetailPage = async (props: InterfacePageProps): Promise<PublicationDetailPage> => {
  let tenant;

  if (props.tenant) {
    // eslint-disable-next-line prefer-destructuring
    tenant = props.tenant;
  } else {
    tenant = await getTenant();
  }

  const payload = await getPayloadCached();

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
      slug: slugify(props.title, {
        lower: true,
        strict: true,
        trim: true,
      }),
      tenant,
    },
    draft: false,
    locale: props.locale || 'de',
  });

  return document;
};
