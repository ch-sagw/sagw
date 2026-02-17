/* eslint-disable @typescript-eslint/naming-convention */

import { Payload } from 'payload';

import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { rte4ConsentBannerText } from '@/utilities/rteSampleContent';
import { seoData } from '@/seed/test-data/seoData';

interface InterfaceAddDataForTenantProps {
  payload: Payload;
  tenant: string;
  tenantId: string;
}

export const addPlaywrightDataForTenant = async (props: InterfaceAddDataForTenantProps): Promise<void> => {

  const {
    payload,
    tenantId,
    tenant,
  } = props;

  // ############
  // Assets
  // ############

  // add image
  const image = await payload.create({
    collection: 'images',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      alt: `${tenant.toUpperCase()} image`,
      tenant: tenantId,
    },
    filePath: `src/seed/test-data/assets/${tenant}.png`,
  });

  // add video
  await payload.create({
    collection: 'videos',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      tenant: tenantId,
      title: `video ${tenant}`,
    },
    filePath: `src/seed/test-data/assets/${tenant}.mp4`,
  });

  if (tenant !== 'sagw') {
    // this way, we can test if sagw tenant can add a document with
    // zenodo id 15126918. uniqueness should only be applied inside same
    // tenant...
    await payload.create({
      collection: 'zenodoDocuments',
      context: {
        skipCacheInvalidation: true,
      },
      data: {
        files: [
          {
            format: 'pdf',
            id: 'someid',
            link: 'https://foo.bar',
            size: 0.26,
          },
        ],
        publicationDate: '1919-05-01',
        tenant: tenantId,
        title: `Sample Zenodo Document ${tenant.toUpperCase()}`,
        zenodoId: '15126918',
      },
    });
  }

  // ############
  // Global Content
  // ############

  // add footer data
  await payload.create({
    collection: 'footer',
    context: {
      skipCacheInvalidation: true,
    },
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
        copyright: simpleRteConfig(`Copyright ${tenant.toUpperCase()}`),
        dataPrivacy: simpleRteConfig(`Legal ${tenant.toUpperCase()}`),
        impressum: simpleRteConfig(`Impressum ${tenant.toUpperCase()}`),
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
      tenant: tenantId,
    },
  });

  // add status message
  await payload.create({
    collection: 'statusMessage',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      content: {
        message: simpleRteConfig(`Eigentlich undenkbar, aber trotzdem passiert. Bitte entschuldigen Sie die Unannehmlichkeiten und versuchen Sie es später erneut. ${tenant.toUpperCase()}`),
        optionalLink: {
          includeLink: true,
          link: {
            internalLink: {
              documentId: '12345',
              slug: 'some-slug',
            },
            linkText: simpleRteConfig('Some action link'),
          },
        },
        show: {
          display: 'show',
        },
        showOnHomeOnly: false,
        title: simpleRteConfig(`Das System ist aktuell nicht verfügbar ${tenant.toUpperCase()}`),
        type: 'warn',
      },
      tenant: tenantId,
    },
  });

  // add i18n data
  await payload.create({
    collection: 'i18nGlobals',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      bibliographicReference: {
        copyButtonText: simpleRteConfig('Copy button text'),
        title: simpleRteConfig('Title'),
      },
      forms: {
        dataPrivacyCheckbox: {
          dataPrivacyCheckboxText: simpleRteConfig(`Data privacy checkbox ${tenant.toUpperCase()}`),
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
      tenant: tenantId,
    },
  });

  // ############
  // Pages
  // ############

  // create home
  const home = await payload.create({
    collection: 'homePage',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      _status: 'published',
      content: [],
      hero: {
        animated: true,
        lead: simpleRteConfig('Home Lead'),
        sideTitle: simpleRteConfig('Home Side-Title'),
        title: simpleRteConfig(`Home Title ${tenant.toUpperCase()}`),
      },
      meta: {
        seo: {
          description: `SEO Description ${tenant.toUpperCase()}`,
          image: image.id,
          index: true,
          title: `SEO Title ${tenant.toUpperCase()}`,
        },
      },
      navigationTitle: 'Home',
      tenant: tenantId,
    },
  });

  // add some detail pages to link to in header
  const navLinkDetail1 = await payload.create({
    collection: 'detailPage',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      _status: 'published',
      hero: {
        colorMode: 'white',
        lead: simpleRteConfig('Detail Page for nav link 1 lead'),
        title: simpleRteConfig(`Detail Page for nav link 1 ${tenant.toUpperCase()}`),
      },
      ...seoData,
      navigationTitle: `Detail Page for nav link 1 ${tenant.toUpperCase()}`,
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      slug: `detail-page-for-nav-link-1-${tenant.toLocaleLowerCase()}`,
      tenant: tenantId,
    },
  });

  const navLinkDetail2 = await payload.create({
    collection: 'detailPage',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      _status: 'published',
      hero: {
        colorMode: 'white',
        lead: simpleRteConfig('Detail Page for nav link 2 lead'),
        title: simpleRteConfig(`Detail Page for nav link 2 ${tenant.toUpperCase()}`),
      },
      ...seoData,
      navigationTitle: `Detail Page for nav link 2 ${tenant.toUpperCase()}`,
      parentPage: {
        documentId: navLinkDetail1.id,
        slug: 'detailPage',
      },
      slug: `detail-page-for-nav-link-2-${tenant.toLocaleLowerCase()}`,
      tenant: tenantId,
    },
  });

  const navLinkDetail3 = await payload.create({
    collection: 'detailPage',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      _status: 'published',
      hero: {
        colorMode: 'white',
        lead: simpleRteConfig('Detail Page for nav link 3 lead'),
        title: simpleRteConfig(`Detail Page for nav link 3 ${tenant.toUpperCase()}`),
      },
      ...seoData,
      navigationTitle: `Detail Page for nav link 3 ${tenant.toUpperCase()}`,
      parentPage: {
        documentId: navLinkDetail2.id,
        slug: 'detailPage',
      },
      slug: `detail-page-for-nav-link-3-${tenant.toLocaleLowerCase()}`,
      tenant: tenantId,
    },
  });

  // add header data
  await payload.create({
    collection: 'header',
    context: {
      skipCacheInvalidation: true,
    },
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
          {
            linkExternal: {
              externalLink: 'https://www.foo.bar',
              externalLinkText: simpleRteConfig('Intranet'),
            },
            linkType: 'external',
          },
          {
            linkExternal: {
              externalLink: 'https://www.foo.bar',
              externalLinkText: simpleRteConfig('mySAGW'),
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
              documentId: navLinkDetail1.id,
              slug: 'detailPage',
            },
            navItemText: simpleRteConfig('Home'),
          },
          {
            description: simpleRteConfig('Förderung von langfristigen Forschungsinfrastrukturen'),
            navItemText: simpleRteConfig('Förderung'),
            subNavItems: [
              {
                navItemLink: {
                  documentId: navLinkDetail2.id,
                  slug: 'detailPage',
                },
                navItemText: simpleRteConfig('Übersicht'),
              },
              {
                navItemLink: {
                  documentId: navLinkDetail3.id,
                  slug: 'detailPage',
                },
                navItemText: simpleRteConfig('Institute'),
              },
              {
                navItemLink: {
                  documentId: navLinkDetail1.id,
                  slug: 'detailPage',
                },
                navItemText: simpleRteConfig('Editionen'),
              },
              {
                navItemLink: {
                  documentId: navLinkDetail2.id,
                  slug: 'detailPage',
                },
                navItemText: simpleRteConfig('Reisebeiträge'),
              },
              {
                navItemLink: {
                  documentId: navLinkDetail3.id,
                  slug: 'detailPage',
                },
                navItemText: simpleRteConfig('Early Career Award'),
              },
            ],
          },
          {
            description: simpleRteConfig('Unsere 63 Fachgesellschaften unter einem Dach'),
            navItemText: simpleRteConfig('Netzwerk'),
            subNavItems: [
              {
                navItemLink: {
                  documentId: navLinkDetail1.id,
                  slug: 'detailPage',
                },
                navItemText: simpleRteConfig('Fachgesellschaften'),
              },
            ],
          },
          {
            description: simpleRteConfig('Vermittlung von Wissen zwischen Wissenschaft und Gesellschaft'),
            navItemText: simpleRteConfig('Aktivitäten'),
            subNavItems: [
              {
                navItemLink: {
                  documentId: navLinkDetail2.id,
                  slug: 'detailPage',
                },
                navItemText: simpleRteConfig('Übersicht'),
              },
              {
                navItemLink: {
                  documentId: navLinkDetail3.id,
                  slug: 'detailPage',
                },
                navItemText: simpleRteConfig('Magazin'),
              },
              {
                navItemLink: {
                  documentId: navLinkDetail1.id,
                  slug: 'detailPage',
                },
                navItemText: simpleRteConfig('Publikationen'),
              },
              {
                navItemLink: {
                  documentId: navLinkDetail2.id,
                  slug: 'detailPage',
                },
                navItemText: simpleRteConfig('Veranstaltungen'),
              },
              {
                navItemLink: {
                  documentId: navLinkDetail3.id,
                  slug: 'detailPage',
                },
                navItemText: simpleRteConfig('News'),
              },
            ],
          },
          {
            description: simpleRteConfig('Alles Wissenswertes über die SAGW'),
            navItemText: simpleRteConfig('Über uns'),
            subNavItems: [
              {
                navItemLink: {
                  documentId: navLinkDetail1.id,
                  slug: 'detailPage',
                },
                navItemText: simpleRteConfig('Die SAGW'),
              },
              {
                navItemLink: {
                  documentId: navLinkDetail2.id,
                  slug: 'detailPage',
                },
                navItemText: simpleRteConfig('Team'),
              },
              {
                navItemLink: {
                  documentId: navLinkDetail3.id,
                  slug: 'detailPage',
                },
                navItemText: simpleRteConfig('Kontakt'),
              },
              {
                navItemLink: {
                  documentId: navLinkDetail1.id,
                  slug: 'detailPage',
                },
                navItemText: simpleRteConfig('Offene Stellen'),
              },
            ],
          },
        ],
      },
      tenant: tenantId,
    },
  });

  // create error page
  await payload.create({
    collection: 'errorPage',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      _status: 'published',
      error400: {
        description: simpleRteConfig('Error description'),
        title: simpleRteConfig(`Not found title ${tenant.toUpperCase()}`),
      },
      error500: {
        description: simpleRteConfig('Error description'),
        title: simpleRteConfig(`Not found title ${tenant.toUpperCase()}`),
      },
      homeButtonText: simpleRteConfig('Home Button Text'),
      ...seoData,
      tenant: tenantId,
    },
  });

  // create impressum page
  await payload.create({
    collection: 'impressumPage',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      _status: 'published',
      content: [
        {
          blockType: 'textBlock',
          text: simpleRteConfig(`some impressum content for ${tenant}`),
        },
      ],
      hero: {
        colorMode: 'dark',
        title: simpleRteConfig(`Impressum page ${tenant}`),
      },
      ...seoData,
      tenant: tenantId,
    },
  });

  // create data privacy page
  await payload.create({
    collection: 'dataPrivacyPage',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      _status: 'published',
      content: [
        {
          blockType: 'textBlock',
          text: simpleRteConfig(`some data privacy content for ${tenant}`),
        },
      ],
      hero: {
        colorMode: 'dark',
        title: simpleRteConfig(`Data privacy page ${tenant}`),
      },
      ...seoData,
      tenant: tenantId,
    },
  });

  // create draft detail page
  await payload.create({
    collection: 'detailPage',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      _status: 'draft',
      hero: {
        colorMode: 'white',
        lead: simpleRteConfig('DRAFT Detail Page Lead'),
        title: simpleRteConfig(`DRAFT Detail page title ${tenant.toUpperCase()}`),
      },
      slug: `draft-detail-page-title-${tenant.toLocaleLowerCase()}`,
      tenant: tenantId,
    },
    draft: true,
  });

  // add consent data
  await payload.create({
    collection: 'consent',
    data: {
      banner: {
        buttonAcceptAll: simpleRteConfig('Alle zulassen'),
        buttonCustomizeSelection: simpleRteConfig('Auswahl anpassen'),
        buttonDeclineAll: simpleRteConfig('Alle ablehnen'),
        text: rte4ConsentBannerText(home.id),
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
      tenant: tenantId,
    },
  });

};
