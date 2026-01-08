/* eslint-disable @typescript-eslint/naming-convention */

import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  Config as ConfigFromTypes,
  Consent,
  DataPrivacyPage,
  DetailPage,
  EventDetailPage,
  Footer,
  Header,
  HomePage,
  I18NGlobal,
  ImpressumPage,
  InstituteDetailPage,
  MagazineDetailPage,
  NationalDictionaryDetailPage,
  NewsDetailPage,
  OverviewPage,
  ProjectDetailPage,
  PublicationDetailPage,
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

type InterfaceEventPageProps = {
  date?: string;
} & InterfacePageProps;

type InterfaceNewsPageProps = {
  date?: string;
} & InterfacePageProps;

type InterfaceMagazinePageProps = {
  date?: string;
} & InterfacePageProps;

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
      _status: 'published',
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
        date: props.date
          ? props.date
          : '2030-08-01T12:00:00.000Z',
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
