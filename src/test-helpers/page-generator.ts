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
