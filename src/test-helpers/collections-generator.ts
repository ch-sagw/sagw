/* eslint-disable @typescript-eslint/naming-convention */

import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  Config as ConfigFromTypes,
  Consent,
  DataPrivacyPage,
  DetailPage,
  Document,
  EventCategory,
  EventDetailPage,
  Footer,
  Form,
  Header,
  HomePage,
  I18NGlobal,
  Image,
  ImpressumPage,
  InstituteDetailPage,
  MagazineDetailPage,
  NationalDictionaryDetailPage,
  NetworkCategory,
  NewsDetailPage,
  OverviewPage,
  Person,
  Project,
  ProjectDetailPage,
  PublicationDetailPage,
  PublicationTopic,
  PublicationType,
  Team,
  Video,
  ZenodoDocument,
} from '@/payload-types';

import { getTenant } from '@/test-helpers/tenant-generator';
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

type InterfaceProjectPageProps = {
  date?: string;
  project?: string;
} & InterfacePageProps;

type InterfacePublicationPageProps = {
  date?: string;
  topic?: string;
  type?: string;
  project?: string;
} & InterfacePageProps;

type InterfaceEventPageProps = {
  date?: string;
  category?: string;
  project?: string;
} & InterfacePageProps;

type InterfaceNewsPageProps = {
  date?: string;
  project?: string;
} & InterfacePageProps;

type InterfaceMagazinePageProps = {
  date?: string;
} & InterfacePageProps;

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

  const homeDocs = await payload.find({
    collection: 'homePage',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  let homePage;

  if (homeDocs.docs.length < 1) {
    homePage = await payload.create({
      collection: 'homePage',
      data: {
        _status: 'published',
        hero: {
          sideTitle: simpleRteConfig(sideTitle),
          title: simpleRteConfig(title),
        },
        tenant,
      },
      locale: locale || 'de',
    });
  } else {
    /* eslint-disable prefer-destructuring */
    homePage = homeDocs.docs[0];
    /* eslint-enable prefer-destructuring */
  }

  return homePage;
};

const getEnsuredParentPage = async ({
  locale,
  tenant,
  parentPage,
}: {
  locale?: ConfigFromTypes['locale'];
  tenant: string | null;
  parentPage: {
    slug: string,
    documentId: string;
  } | undefined;
}): Promise<{
  slug: string,
  documentId: string;
}> => {
  if (!tenant) {
    throw new Error('No tenant found in collections-generator');
  }

  let ensuredParentPage = parentPage;

  if (!parentPage) {
    const homeId = (await generateHomePage({
      locale: locale || 'de',
      sideTitle: 'Side',
      tenant,
      title: 'Home',
    })).id;

    ensuredParentPage = {
      documentId: homeId,
      slug: 'homePage',
    };
  }

  return ensuredParentPage as {
    slug: string,
    documentId: string;
  };
};

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

  const ensuredParentPage = await getEnsuredParentPage({
    locale,
    parentPage,
    tenant,
  });

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
      navigationTitle: navigationTitle || 'some navigation title',
      parentPage: ensuredParentPage,
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

export const generateOverviewPage = async (props: InterfacePageProps): Promise<OverviewPage> => (await generatePage({
  ...props,
  type: 'overviewPage',
})) as OverviewPage;

export const generateDetailPage = async (props: InterfacePageProps): Promise<DetailPage> => (await generatePage({
  ...props,
  type: 'detailPage',
})) as DetailPage;

export const generateEventDetailPage = async (props: InterfaceEventPageProps): Promise<EventDetailPage> => {
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

  let {
    project,
  } = props;

  if (!project) {
    const projectItem = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig(`Project ${(new Date())
          .getTime()}`),
        tenant,
      },
      locale: props.locale || 'de',
    });

    project = projectItem.id;
  }

  let {
    category,
  } = props;

  if (!category) {
    const categoryItem = await payload.create({
      collection: 'eventCategory',
      data: {
        eventCategory: simpleRteConfig(`Category ${(new Date())
          .getTime()}`),
        tenant,
      },
      locale: props.locale || 'de',
    });

    category = categoryItem.id;
  }

  const ensuredParentPage = await getEnsuredParentPage({
    locale: props.locale,
    parentPage: props.parentPage,
    tenant,
  });

  const document = await payload.create({
    collection: 'eventDetailPage',
    data: {
      _status: 'published',
      eventDetails: {
        category,
        date: props.date
          ? props.date
          : '2030-08-01T12:00:00.000Z',
        dateEnd: '2026-01-01T13:00:00.000Z',
        language: simpleRteConfig('Deutsch'),
        location: simpleRteConfig('ETH Zürich'),
        project,
        time: '2025-08-31T12:00:00.000Z',
        title: simpleRteConfig(props.title),
      },
      navigationTitle: props.navigationTitle || 'some navigation title',
      parentPage: ensuredParentPage,
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

  const ensuredParentPage = await getEnsuredParentPage({
    locale: props.locale,
    parentPage: props.parentPage,
    tenant,
  });

  const document = await payload.create({
    collection: 'instituteDetailPage',
    data: {
      _status: 'published',
      hero: {
        colorMode: 'light',
        title: simpleRteConfig(props.title),
      },
      navigationTitle: props.navigationTitle || 'some navigation title',
      overviewPageProps: {
        image: image.id,
        teaserText: simpleRteConfig('some text'),
      },
      parentPage: ensuredParentPage,
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

export const generateMagazineDetailPage = async (props: InterfaceMagazinePageProps): Promise<MagazineDetailPage> => {
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

  const ensuredParentPage = await getEnsuredParentPage({
    locale: props.locale,
    parentPage: props.parentPage,
    tenant,
  });

  const document = await payload.create({
    collection: 'magazineDetailPage',
    data: {
      _status: 'published',
      hero: {
        author: simpleRteConfig('author'),
        colorMode: 'light',
        date: props.date
          ? props.date
          : '2030-08-01T12:00:00.000Z',
        title: simpleRteConfig(props.title),
      },
      navigationTitle: props.navigationTitle || 'some navigation title',
      overviewPageProps: {
        teaserText: simpleRteConfig('some text'),
      },
      parentPage: ensuredParentPage,
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

  const ensuredParentPage = await getEnsuredParentPage({
    locale: props.locale,
    parentPage: props.parentPage,
    tenant,
  });

  const document = await payload.create({
    collection: 'nationalDictionaryDetailPage',
    data: {
      _status: 'published',
      hero: {
        colorMode: 'light',
        title: simpleRteConfig(props.title),
      },
      navigationTitle: props.navigationTitle || 'some navigation title',
      overviewPageProps: {
        teaserText: simpleRteConfig('some text'),
      },
      parentPage: ensuredParentPage,
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

export const generateNewsDetailPage = async (props: InterfaceNewsPageProps): Promise<NewsDetailPage> => {
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

  const ensuredParentPage = await getEnsuredParentPage({
    locale: props.locale,
    parentPage: props.parentPage,
    tenant,
  });

  const document = await payload.create({
    collection: 'newsDetailPage',
    data: {
      _status: 'published',
      hero: {
        colorMode: 'light',
        date: props.date
          ? props.date
          : '2030-08-01T12:00:00.000Z',
        title: simpleRteConfig(props.title),
      },
      navigationTitle: props.navigationTitle || 'some navigation title',
      overviewPageProps: {
        teaserText: simpleRteConfig('some text'),
      },
      parentPage: ensuredParentPage,
      project: props.project,
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

export const generateProjectDetailPage = async (props: InterfaceProjectPageProps): Promise<ProjectDetailPage> => {
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

  let {
    project,
  } = props;

  if (!project) {
    const projectItem = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig(`Project ${(new Date())
          .getTime()}`),
        tenant,
      },
      locale: 'de',
    });

    project = projectItem.id;
  }

  const ensuredParentPage = await getEnsuredParentPage({
    locale: props.locale,
    parentPage: props.parentPage,
    tenant,
  });

  const document = await payload.create({
    collection: 'projectDetailPage',
    data: {
      _status: 'published',
      hero: {
        colorMode: 'light',
        title: simpleRteConfig(props.title),
      },
      navigationTitle: props.navigationTitle || 'some navigation title',
      overviewPageProps: {
        linkText: simpleRteConfig('some text'),
        teaserText: simpleRteConfig('some text'),
      },
      parentPage: ensuredParentPage,
      project,
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

export const generatePublicationDetailPage = async (props: InterfacePublicationPageProps): Promise<PublicationDetailPage> => {
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

  const ensuredParentPage = await getEnsuredParentPage({
    locale: props.locale,
    parentPage: props.parentPage,
    tenant,
  });

  const document = await payload.create({
    collection: 'publicationDetailPage',
    data: {
      _status: 'published',
      categorization: {
        project: props.project,
        topic: props.topic,
        type: props.type,
      },
      hero: {
        colorMode: 'light',
        title: simpleRteConfig(props.title),
      },
      navigationTitle: props.navigationTitle || 'some navigation title',
      overviewPageProps: {
        date: props.date || '2030-08-01T12:00:00.000Z',
        image: image.id,
      },
      parentPage: ensuredParentPage,
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

export const generateFooterData = async ({
  tenant,
}: {
  tenant: string;
}): Promise<Footer> => {
  const payload = await getPayloadCached();

  const footerPage = await payload.create({
    collection: 'footer',
    data: {
      contact: {
        address1: simpleRteConfig('Haus der Akademien'),
        address2: simpleRteConfig('Laupenstrasse 7'),
        city: simpleRteConfig('Bern'),
        countryCode: simpleRteConfig('CH'),
        mail: simpleRteConfig('sagw@sagw.ch'),
        phone: simpleRteConfig('+41 31 306 92 50'),
        poBox: simpleRteConfig('Postfach'),
        title: simpleRteConfig('SAGW Schweizerische Akademie der Geistes- und Sozialwissenschaften'),
        zipCode: simpleRteConfig('3001'),
      },
      legal: {
        cookieSettings: simpleRteConfig('Cookie-Einstellungen'),
        copyright: simpleRteConfig('Copyright'),
        dataPrivacy: simpleRteConfig('Legal'),
        impressum: simpleRteConfig('Impressum'),
      },
      socialLinks: {
        items: [
          {
            externalLink: 'https://www.foo.bar',
            icon: 'instagram',
          },
          {
            externalLink: 'https://www.foo.bar',
            icon: 'facebook',
          },
          {
            externalLink: 'https://www.foo.bar',
            icon: 'twitter',
          },
          {
            externalLink: 'https://www.foo.bar',
            icon: 'linkedIn',
          },
        ],
      },
      tenant,
    },
  });

  return footerPage;
};

export const generateI18nData = async ({
  tenant,
}: {
  tenant: string;
}): Promise<I18NGlobal> => {
  const payload = await getPayloadCached();
  const i18nData = await payload.create({
    collection: 'i18nGlobals',
    data: {
      bibliographicReference: {
        copyButtonText: simpleRteConfig('Copy button text'),
        title: simpleRteConfig('Title'),
      },
      forms: {
        dataPrivacyCheckbox: {
          dataPrivacyCheckboxText: simpleRteConfig('Data privacy checkbox'),
          errorMessage: simpleRteConfig('Bitte akzeptieren sie die allgemeinen Geschäftsbedingungen'),
        },
      },
      generic: {
        downloadTitle: simpleRteConfig('Download title'),
        exportArticleButtonText: simpleRteConfig('Export article button text'),
        linksTitle: simpleRteConfig('Links'),
        time: simpleRteConfig('Uhr'),
        writeEmailButtonText: simpleRteConfig('Write email button text'),
      },
      tenant,
    },

  });

  return i18nData;
};

export const generateConsentData = async ({
  tenant,
}: {
  tenant: string;
}): Promise<Consent> => {
  const payload = await getPayloadCached();

  const consentData = await payload.create({
    collection: 'consent',
    data: {
      banner: {
        buttonAcceptAll: simpleRteConfig('Alle zulassen'),
        buttonCustomizeSelection: simpleRteConfig('Auswahl anpassen'),
        buttonDeclineAll: simpleRteConfig('Alle ablehnen'),
        text: simpleRteConfig('Banner text'),
        title: simpleRteConfig('Diese Webseite verwendet Cookies'),
      },
      overlay: {
        analyticsPerformance: {
          text: simpleRteConfig('Diese Gruppe beinhaltet alle Cookies von Skripts für analytisches Tracking. Die Analysen helfen uns, die Nutzer*innenerfahrung der Website zu verbessern.'),
          title: simpleRteConfig('Analytics und Performance'),
          toggleDefault: 'off',
          toggleLabelOff: simpleRteConfig('Aus'),
          toggleLabelOn: simpleRteConfig('An'),
        },
        buttonAcceptAll: simpleRteConfig('Alle zulassen'),
        buttonAcceptSelection: simpleRteConfig('Auswahl zulassen'),
        externalContent: {
          text: simpleRteConfig('Externe Inhalte umfassen Cookies, die von Drittanbietern gesetzt werden, damit wir auf unserer Website Inhalte von deren Plattform bereitstellen können (wie z.B. Videos oder Social Media Feeds).'),
          title: simpleRteConfig('Externe Inhalte'),
          toggleDefault: 'off',
          toggleLabelOff: simpleRteConfig('Aus'),
          toggleLabelOn: simpleRteConfig('An'),
        },
        necessaryCookies: {
          text: simpleRteConfig('Diese Cookies sind notwendig für die grundlegenden Funktionen der Website. Ohne sie ist nicht gewährleistet, dass die Website einwandfrei funktioniert.'),
          title: simpleRteConfig('Notwendige Cookies'),
          toggleLabel: simpleRteConfig('Immer an'),
        },
        text: simpleRteConfig('Sie haben die volle Kontrolle über Ihre Privatsphäre und entscheiden selbst, welche Cookies wir verwenden dürfen und welche nicht.'),
        title: simpleRteConfig('Cookies Einstellungen'),
      },
      tenant,
    },
  });

  return consentData;
};

export const generateDataPrivacyPage = async ({
  tenant,
}: {
  tenant: string;
}): Promise<DataPrivacyPage> => {
  const payload = await getPayloadCached();

  const dataPrivacyPage = await payload.create({
    collection: 'dataPrivacyPage',
    data: {
      _status: 'published',
      content: [
        {
          blockType: 'textBlock',
          text: simpleRteConfig('some data privacy content'),
        },
      ],
      hero: {
        colorMode: 'dark',
        title: simpleRteConfig('Data privacy page'),
      },
      tenant,
    },
  });

  return dataPrivacyPage;
};

export const generateImpressumPage = async ({
  tenant,
}: {
  tenant: string;
}): Promise<ImpressumPage> => {
  const payload = await getPayloadCached();

  const impressumPage = await payload.create({
    collection: 'impressumPage',
    data: {
      _status: 'published',
      content: [
        {
          blockType: 'textBlock',
          text: simpleRteConfig('some impressum content'),
        },
      ],
      hero: {
        colorMode: 'dark',
        title: simpleRteConfig('Impressum page'),
      },
      tenant,
    },
  });

  return impressumPage;
};

export const generateHeaderData = async ({
  tenant,
}: {
  tenant: string;
}): Promise<Header> => {
  const payload = await getPayloadCached();
  const time = (new Date())
    .getTime();

  const detailPage = await generateDetailPage({
    tenant,
    title: `generated-detail-${time}`,
  });

  const headerData = await payload.create({
    collection: 'header',
    data: {
      metanavigation: {
        metaLinks: [
          {
            linkExternal: {
              externalLink: 'https://www.foo.bar',
              externalLinkText: simpleRteConfig('Brand Guidelines'),
            },
            linkType: 'external',
          },
        ],
      },
      navigation: {
        navItems: [
          {
            description: simpleRteConfig(''),
            navItemLink: {
              documentId: detailPage.id,
              slug: 'detailPage',
            },
            navItemText: simpleRteConfig('Home'),
          },
        ],
      },
      tenant,
    },
  });

  return headerData;
};

export const getHomeId = async ({
  isSagw,
  tenant,
}: {
  isSagw: boolean;
  tenant: string;
}): Promise<string> => {
  const payload = await getPayloadCached();
  let home;

  if (isSagw) {
    const homeDocs = await payload.find({
      collection: 'homePage',
      where: {
        tenant: {
          equals: tenant,
        },
      },
    });

    home = homeDocs.docs[0].id;

    await payload.update({
      collection: 'homePage',
      data: {
        content: [],
      },
      id: home,
    });

  } else {
    home = (await generateHomePage({
      locale: 'de',
      sideTitle: 'Side',
      tenant,
      title: 'Home',
    })).id;

    // add remainig home data
    await generateFooterData({
      tenant,
    });

    await generateI18nData({
      tenant,
    });

    await generateConsentData({
      tenant,
    });

    await generateImpressumPage({
      tenant,
    });

    await generateDataPrivacyPage({
      tenant,
    });

    await generateHeaderData({
      tenant,
    });
  }

  return home;
};

// #########################################
// generate collections except pages
// #########################################
interface InterfaceGenerateCollectionsExceptPages {
  document: Document;
  zenodoDocument: ZenodoDocument;
  eventCategory: EventCategory;
  image: Image;
  networkCategory: NetworkCategory;
  newsletterForm: Form;
  person: Person;
  project: Project;
  publicationTopic: PublicationTopic;
  publicationType: PublicationType;
  team: Team;
  video: Video;
  form: Form;
}

export const generateCollectionsExceptPages = async ({
  tenant,
  isSagw = true,
}: {
  tenant: string;
  isSagw?: boolean;
}): Promise<InterfaceGenerateCollectionsExceptPages> => {
  const payload = await getPayloadCached();

  const image = await payload.create({
    collection: 'images',
    data: {
      alt: `image ${isSagw
        ? 'sagw'
        : 'non-sagw'}`,
      tenant,
    },
    filePath: `src/seed/test-data/assets/${isSagw
      ? 'sagw'
      : 'not-sagw'}.png`,
  });

  const video = await payload.create({
    collection: 'videos',
    data: {
      tenant,
      title: `video ${isSagw
        ? 'sagw'
        : 'non-sagw'}`,
    },
    filePath: `src/seed/test-data/assets/${isSagw
      ? 'sagw'
      : 'not-sagw'}.mp4`,
  });

  const document = await payload.create({
    collection: 'documents',
    data: {
      date: '2025-10-30',
      tenant,
      title: simpleRteConfig('document'),
    },
    filePath: `src/seed/test-data/assets/${isSagw
      ? 'sagw'
      : 'not-sagw'}.pdf`,
  });

  const zenodoDocument = await payload.create({
    collection: 'zenodoDocuments',
    data: {
      files: [
        {
          format: 'pdf',
          id: 'someid',
          link: 'https://foo.bar',
          size: 0.26,
        },
        {
          format: 'zip',
          id: 'someotherid',
          link: 'https://foo.bar',
          size: 1.54,
        },
      ],
      publicationDate: '1919-05-01',
      tenant,
      title: `Sample Zenodo Document ${isSagw
        ? 'sagw'
        : 'non-sagw'}`,
      zenodoId: '1512691',
    },
  });

  const publicationTopic = await payload.create({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig(`Publication Topic ${isSagw
        ? 'sagw'
        : 'non-sagw'}`),
      tenant,
    },
  });

  const publicationType = await payload.create({
    collection: 'publicationTypes',
    data: {
      publicationType: simpleRteConfig(`Publication Type ${isSagw
        ? 'sagw'
        : 'non-sagw'}`),
      tenant,
    },
  });

  const networkCategory = await payload.create({
    collection: 'networkCategories',
    data: {
      name: simpleRteConfig(`Network Category ${isSagw
        ? 'sagw'
        : 'non-sagw'}`),
      tenant,
    },
  });

  const project = await payload.create({
    collection: 'projects',
    data: {
      name: simpleRteConfig(`Project ${isSagw
        ? 'sagw'
        : 'non-sagw'}`),
      tenant,
    },
    locale: 'de',
  });

  const person = await payload.create({
    collection: 'people',
    data: {
      firstname: simpleRteConfig(`Firstname ${isSagw
        ? 'sagw'
        : 'non-sagw'}`),
      function: simpleRteConfig('Some function'),
      image,
      lastname: simpleRteConfig(`Lastname ${isSagw
        ? 'sagw'
        : 'non-sagw'}`),
      mail: 'foo@bar.com',
      phone: '031 123 45 67',
      tenant,
    },
  });

  const team = await payload.create({
    collection: 'teams',
    data: {
      name: simpleRteConfig(`Team ${isSagw
        ? 'sagw'
        : 'non-sagw'}`),
      people: [person.id],
      tenant,
    },
  });

  const eventCategory = await payload.create({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig(`Event Category ${isSagw
        ? 'sagw'
        : 'non-sagw'}`),
      tenant,
    },
  });

  const form = await payload.create({
    collection: 'forms',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      colorMode: 'dark',
      fields: [
        {
          blockType: 'textBlockForm',
          fieldError: simpleRteConfig('Geben Sie Ihren Namen an.'),
          fieldWidth: 'half',
          label: simpleRteConfig('Name'),
          name: 'name',
          placeholder: 'Ihr Name',
          required: true,
        },
        {
          blockType: 'emailBlock',
          fieldError: simpleRteConfig('Geben Sie ihre E-Mail-Adresse an.'),
          fieldWidth: 'half',
          label: simpleRteConfig('E-Mail'),
          name: 'email',
          placeholder: 'Ihre E-Mail Adresse',
          required: true,
        },
        {
          blockType: 'textareaBlock',
          fieldError: simpleRteConfig('Geben Sie ihren Kommentar an.'),
          fieldWidth: 'full',
          label: simpleRteConfig('Kommentar'),
          name: 'comment',
          placeholder: 'Ihr Kommentar',
          required: true,
        },
        {
          blockType: 'checkboxBlock',
          fieldError: simpleRteConfig('Bitte akzeptieren Sie die Hinweise zum Datenschutz.'),
          fieldWidth: 'full',
          label: simpleRteConfig('Ich habe die Hinweise zum Datenschutz gelesen und akzeptiere sie.'),
          name: 'checkbox-custom',
          required: true,
        },
        {
          blockType: 'radioBlock',
          fieldError: simpleRteConfig('Sie müssen eine Auswahl treffen'),
          fieldWidth: 'full',
          items: [
            {
              label: simpleRteConfig('Deutsch'),
              value: 'deutsch',
            },
            {
              label: simpleRteConfig('Französisch'),
              value: 'french',
            },
          ],
          label: simpleRteConfig('In welcher Sprache möchten Sie den Newsletter erhalten?'),
          name: 'language-select',
          required: true,
        },
      ],
      isNewsletterForm: 'custom',
      mailSubject: 'Form submission on SAGW',
      recipientMail: 'delivered@resend.dev',
      showPrivacyCheckbox: false,
      submitButtonLabel: 'Abschicken',
      submitError: {
        text: simpleRteConfig('Submit text error'),
        title: simpleRteConfig('Submit title error'),
      },
      submitSuccess: {
        text: simpleRteConfig('Submit text success'),
        title: simpleRteConfig('Submit title success'),
      },
      subtitle: simpleRteConfig('Subtitle for contact Form'),
      tenant,
      title: simpleRteConfig(`Contact Form ${isSagw
        ? 'sagw'
        : 'non-sagw'}`),
    },
  });

  // add newsletter form
  const newsletterForm = await payload.create({
    collection: 'forms',
    data: {
      colorMode: 'dark',
      isNewsletterForm: 'newsletter',
      newsletterFields: {
        actionText: 'Erneut senden',
        email: {
          fieldError: simpleRteConfig('Bitte geben Sie die E-Mail Adresse an.'),
          fieldWidth: 'full',
          label: simpleRteConfig('E-Mail'),
          placeholder: 'Ihre E-Mail Adresse',
        },
        firstName: {
          fieldError: simpleRteConfig('Bitte geben Sie Ihren Vornamen an.'),
          fieldWidth: 'half',
          label: simpleRteConfig('Vorname'),
          placeholder: 'Ihr Vorname',
        },
        includeLanguageSelection: 'yes',
        lastName: {
          fieldError: simpleRteConfig('Bitte geben Sie Ihren Nachnamen an.'),
          fieldWidth: 'half',
          label: simpleRteConfig('Nachname'),
          placeholder: 'Ihr Nachname',
        },
        newsletterListId: 2,
        newsletterTemporaryListId: 3,
      },
      recipientMail: 'delivered@resend.dev',
      showPrivacyCheckbox: true,
      submitButtonLabel: 'Abschicken',
      submitError: {
        text: simpleRteConfig('Newsletter Submit text error'),
        title: simpleRteConfig('Newsletter Submit title error'),
      },
      submitSuccess: {
        text: simpleRteConfig('Newsletter Submit text success'),
        title: simpleRteConfig('Newsletter Submit title success'),
      },
      subtitle: simpleRteConfig('Subtitle for Newsletter Form'),
      tenant,
      title: simpleRteConfig(`Newsletter Form ${isSagw
        ? 'sagw'
        : 'non-sagw'}`),
    },
  });

  return {
    document,
    eventCategory,
    form,
    image,
    networkCategory,
    newsletterForm,
    person,
    project,
    publicationTopic,
    publicationType,
    team,
    video,
    zenodoDocument,
  };
};

// #########################################
// generate a page of all types
// #########################################

interface InterfaceGeneratePageTypes {
  detailPage: DetailPage;
  eventDetailPage: EventDetailPage;
  instituteDetailPage: InstituteDetailPage;
  magazineDetailPage: MagazineDetailPage;
  nationalDictionaryDetailPage: NationalDictionaryDetailPage;
  newsDetailPage: NewsDetailPage;
  overviewPage: OverviewPage;
  projectDetailPage: ProjectDetailPage;
  publicationDetailPage: PublicationDetailPage;
}

export const generateAllPageTypes = async ({
  home,
  iterator,
  tenant,
  time,
}: {
  home: string;
  iterator: number;
  tenant: string;
  time: number;
}): Promise<InterfaceGeneratePageTypes> => {
  const overview = await generateOverviewPage({
    navigationTitle: `overview ${iterator} ${time}`,
    parentPage: {
      documentId: home,
      slug: 'homePage',
    },
    tenant,
    title: `overview ${iterator} ${time}`,
  });

  const detail = await generateDetailPage({
    navigationTitle: `detail ${iterator} ${time}`,
    parentPage: {
      documentId: overview.id,
      slug: 'overviewPage',
    },
    tenant,
    title: `detail ${iterator} ${time}`,
  });

  const event = await generateEventDetailPage({
    date: '2029-08-03T12:00:00.000Z',
    navigationTitle: `event ${iterator} ${time}`,
    parentPage: {
      documentId: overview.id,
      slug: 'overviewPage',
    },
    tenant,
    title: `event ${iterator} ${time}`,
  });

  const news = await generateNewsDetailPage({
    date: '2031-08-02T12:00:00.000Z',
    navigationTitle: `news ${iterator} ${time}`,
    parentPage: {
      documentId: overview.id,
      slug: 'overviewPage',
    },
    tenant,
    title: `news ${iterator} ${time}`,
  });

  const project = await generateProjectDetailPage({
    locale: 'de',
    navigationTitle: `project ${iterator} ${time}`,
    parentPage: {
      documentId: overview.id,
      slug: 'overviewPage',
    },
    tenant,
    title: `project ${iterator} ${time}`,
  });

  const magazine = await generateMagazineDetailPage({
    date: '2031-08-01T12:00:00.000Z',
    locale: 'de',
    navigationTitle: `magazine ${iterator} ${time}`,
    parentPage: {
      documentId: overview.id,
      slug: 'overviewPage',
    },
    tenant,
    title: `magazine ${iterator} ${time}`,
  });

  const institute = await generateInstituteDetailPage({
    locale: 'de',
    navigationTitle: `institute ${iterator} ${time}`,
    parentPage: {
      documentId: overview.id,
      slug: 'overviewPage',
    },
    tenant,
    title: `institute ${iterator} ${time}`,
  });

  const nationalDictionary = await generateNationalDictionaryDetailPage({
    locale: 'de',
    navigationTitle: `national dictionary ${iterator} ${time}`,
    parentPage: {
      documentId: overview.id,
      slug: 'overviewPage',
    },
    tenant,
    title: `national dictionary ${iterator} ${time}`,
  });

  const publication = await generatePublicationDetailPage({
    locale: 'de',
    navigationTitle: `publication ${iterator} ${time}`,
    parentPage: {
      documentId: overview.id,
      slug: 'overviewPage',
    },
    tenant,
    title: `publication ${iterator} ${time}`,
  });

  // translations
  const payload = await getPayloadCached();

  await payload.update({
    collection: 'overviewPage',
    data: {
      hero: {
        title: simpleRteConfig(`overview ${iterator} ${time} it`),
      },
      navigationTitle: `overview ${iterator} ${time} it`,
    },
    id: overview.id,
    locale: 'it',
  });

  await payload.update({
    collection: 'detailPage',
    data: {
      hero: {
        title: simpleRteConfig(`detail ${iterator} ${time} it`),
      },
      navigationTitle: `detail ${iterator} ${time} it`,
    },
    id: detail.id,
    locale: 'it',
  });

  await payload.update({
    collection: 'eventDetailPage',
    data: {
      eventDetails: {
        title: simpleRteConfig(`event ${iterator} ${time} it`),
      },
      navigationTitle: `event ${iterator} ${time} it`,
    },
    id: event.id,
    locale: 'it',
  });

  await payload.update({
    collection: 'newsDetailPage',
    data: {
      hero: {
        title: simpleRteConfig(`news ${iterator} ${time} it`),
      },
      navigationTitle: `news ${iterator} ${time} it`,
      overviewPageProps: news.overviewPageProps,
    },
    id: news.id,
    locale: 'it',
  });

  await payload.update({
    collection: 'projectDetailPage',
    data: {
      hero: {
        title: simpleRteConfig(`project ${iterator} ${time} it`),
      },
      navigationTitle: `project ${iterator} ${time} it`,
      overviewPageProps: project.overviewPageProps,
    },
    id: project.id,
    locale: 'it',
  });

  await payload.update({
    collection: 'magazineDetailPage',
    data: {
      hero: {
        author: magazine.hero.author,
        title: simpleRteConfig(`magazine ${iterator} ${time} it`),
      },
      navigationTitle: `magazine ${iterator} ${time} it`,
      overviewPageProps: magazine.overviewPageProps,
    },
    id: magazine.id,
    locale: 'it',
  });

  await payload.update({
    collection: 'instituteDetailPage',
    data: {
      hero: {
        title: simpleRteConfig(`institute ${iterator} ${time} it`),
      },
      navigationTitle: `institute ${iterator} ${time} it`,
      overviewPageProps: institute.overviewPageProps,
    },
    id: institute.id,
    locale: 'it',
  });

  await payload.update({
    collection: 'nationalDictionaryDetailPage',
    data: {
      hero: {
        title: simpleRteConfig(`national dictionary ${iterator} ${time} it`),
      },
      navigationTitle: `national dictionary ${iterator} ${time} it`,
      overviewPageProps: nationalDictionary.overviewPageProps,
    },
    id: nationalDictionary.id,
    locale: 'it',
  });

  await payload.update({
    collection: 'publicationDetailPage',
    data: {
      hero: {
        title: simpleRteConfig(`publication ${iterator} ${time} it`),
      },
      navigationTitle: `publication ${iterator} ${time} it`,
      overviewPageProps: publication.overviewPageProps,
    },
    id: publication.id,
    locale: 'it',
  });

  return {
    detailPage: detail,
    eventDetailPage: event,
    instituteDetailPage: institute,
    magazineDetailPage: magazine,
    nationalDictionaryDetailPage: nationalDictionary,
    newsDetailPage: news,
    overviewPage: overview,
    projectDetailPage: project,
    publicationDetailPage: publication,
  };
};

// #########################################
// other collections
// #########################################

export const generateForm = async (tenant: string): Promise<string> => {
  const payload = await getPayloadCached();
  const form = await payload.create({
    collection: 'forms',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      colorMode: 'dark',
      fields: [
        {
          blockType: 'textBlockForm',
          fieldError: simpleRteConfig('Geben Sie Ihren Namen an.'),
          fieldWidth: 'half',
          label: simpleRteConfig('Name'),
          name: 'name',
          placeholder: 'Ihr Name',
          required: true,
        },
      ],
      isNewsletterForm: 'custom',
      mailSubject: 'Form submission on SAGW',
      recipientMail: 'delivered@resend.dev',
      showPrivacyCheckbox: false,
      submitButtonLabel: 'Abschicken',
      submitError: {
        text: simpleRteConfig('Submit text error'),
        title: simpleRteConfig('Submit title error'),
      },
      submitSuccess: {
        text: simpleRteConfig('Submit text success'),
        title: simpleRteConfig('Submit title success'),
      },
      subtitle: simpleRteConfig('Subtitle for contact Form'),
      tenant,
      title: simpleRteConfig('Contact Form'),
    },
  });

  return form.id;
};

export const generateDocument = async (tenant: string, project?: string, title?: string): Promise<string> => {
  const payload = await getPayloadCached();
  const document = await payload.create({
    collection: 'documents',
    data: {
      date: '2025-10-30',
      project,
      tenant,
      title: simpleRteConfig(title || 'Document'),
    },
    filePath: 'src/seed/test-data/assets/sagw.pdf',
  });

  return document.id;
};

export const generateZenodoDocument = async (tenant: string, project?: string, title?: string): Promise<string> => {
  const payload = await getPayloadCached();
  const zenodoDocument = await payload.create({
    collection: 'zenodoDocuments',
    data: {
      files: [
        {
          format: 'pdf',
          id: 'someid',
          link: 'https://foo.bar',
          size: 0.26,
        },
        {
          format: 'zip',
          id: 'someotherid',
          link: 'https://foo.bar',
          size: 1.54,
        },
      ],
      project,
      publicationDate: '1919-05-01',
      tenant,
      title: title || 'Sample Zenodo Document',
      zenodoId: '1512691',
    },
  });

  return zenodoDocument.id;
};

export const generateImage = async (tenant: string): Promise<string> => {
  const payload = await getPayloadCached();
  const image = await payload.create({
    collection: 'images',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      alt: 'image',
      tenant,
    },
    filePath: 'src/seed/test-data/assets/sagw.png',
  });

  return image.id;
};

export const generateVideo = async (tenant: string): Promise<string> => {
  const payload = await getPayloadCached();
  const video = await payload.create({
    collection: 'videos',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      tenant,
      title: 'video',
    },
    filePath: 'src/seed/test-data/assets/sagw.mp4',
  });

  return video.id;
};
