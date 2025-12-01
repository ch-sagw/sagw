/* eslint-disable @typescript-eslint/naming-convention */

import { Payload } from 'payload';

import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  rte4ConsentBannerText, rte4FullRange,
  sampleFootnoteContent,
} from '@/utilities/rteSampleContent';
import { InterfaceNetworkTeaserPropTypes } from '@/components/blocks/NetworkTeaser/NetworkTeaser';

interface InterfaceAddDataForTenantProps {
  payload: Payload;
  tenant: string;
  tenantId: string;
}

export const addDataForTenant = async (props: InterfaceAddDataForTenantProps): Promise<void> => {

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
    data: {
      alt: `${tenant.toUpperCase()} image`,
      tenant: tenantId,
    },
    filePath: `src/seed/test-data/assets/${tenant}.png`,
  });

  // add video
  await payload.create({
    collection: 'videos',
    data: {
      tenant: tenantId,
      title: `video ${tenant}`,
    },
    filePath: `src/seed/test-data/assets/${tenant}.mp4`,
  });

  // add document
  const document = await payload.create({
    collection: 'documents',
    data: {
      date: '2025-10-30',
      tenant: tenantId,
      title: simpleRteConfig(`${tenant.toUpperCase()} Document`),
    },
    filePath: `src/seed/test-data/assets/${tenant}.pdf`,
  });

  // add zenodo document
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
      tenant: tenantId,
      title: `Sample Zenodo Document ${tenant.toUpperCase()}`,
      zenodoId: '1512691',
    },
  });

  if (tenant !== 'sagw') {
    // this way, we can test if sagw tenant can add a document with
    // zenodo id 15126918. uniqueness should only be applied inside same
    // tenant...
    await payload.create({
      collection: 'zenodoDocuments',
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

  // create publication topic
  const publicationTopic = await payload.create({
    collection: 'publicationTopics',
    data: {
      publicationTopic: simpleRteConfig(`Publication Topic 1 ${tenant.toUpperCase()}`),
      tenant: tenantId,
    },
  });

  // create publication type
  const publicationType = await payload.create({
    collection: 'publicationTypes',
    data: {
      publicationType: simpleRteConfig(`Publication Type 1 ${tenant.toUpperCase()}`),
      tenant: tenantId,
    },
  });

  // create network categories
  const networkCategory1 = await payload.create({
    collection: 'networkCategories',
    data: {
      name: simpleRteConfig(`Network Category 1 ${tenant.toUpperCase()}`),
      tenant: tenantId,
    },
  });

  const networkCategory2 = await payload.create({
    collection: 'networkCategories',
    data: {
      name: simpleRteConfig(`Network Category 2 ${tenant.toUpperCase()}`),
      tenant: tenantId,
    },
  });

  const networkCategory3 = await payload.create({
    collection: 'networkCategories',
    data: {
      name: simpleRteConfig(`Network Category 3 ${tenant.toUpperCase()}`),
      tenant: tenantId,
    },
  });

  const networkCategories = [
    networkCategory1,
    networkCategory2,
    networkCategory3,
  ];

  // create project
  const project = await payload.create({
    collection: 'projects',
    data: {
      name: simpleRteConfig(`DE Project 1 ${tenant.toUpperCase()}`),
      tenant: tenantId,
    },
    locale: 'de',
  });

  // create person in people
  const people = await Promise.all(Array.from({
    length: 12,
  }, (_, i) => {
    const index = i + 1;

    return payload.create({
      collection: 'people',
      data: {
        firstname: simpleRteConfig(`Firstname ${index} ${tenant.toUpperCase()}`),
        function: simpleRteConfig('Some function'),
        image,
        lastname: simpleRteConfig(`Lastname ${index} ${tenant.toUpperCase()}`),
        mail: 'foo@bar.com',
        phone: '031 123 45 67',
        tenant: tenantId,
      },
    });
  }));

  const [person] = people;

  // create a team
  const team = await payload.create({
    collection: 'teams',
    data: {
      name: simpleRteConfig(`Team 1 ${tenant.toUpperCase()}`),
      people: people.map((item) => item.id),
      tenant: tenantId,
    },
  });

  // create event category
  const eventCategory = await payload.create({
    collection: 'eventCategory',
    data: {
      eventCategory: simpleRteConfig(`Event Category 1 ${tenant.toUpperCase()}`),
      tenant: tenantId,
    },
  });

  // add footer data
  await payload.create({
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

  // add header data
  await payload.create({
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
              documentId: '12334',
              slug: 'someSlug',
            },
            navItemText: simpleRteConfig('Home'),
          },
          {
            description: simpleRteConfig('Förderung von langfristigen Forschungsinfrastrukturen'),
            navItemText: simpleRteConfig('Förderung'),
            subNavItems: [
              {
                navItemLink: {
                  documentId: '12334',
                  slug: 'someSlug',
                },
                navItemText: simpleRteConfig('Übersicht'),
              },
              {
                navItemLink: {
                  documentId: '12334',
                  slug: 'someSlug',
                },
                navItemText: simpleRteConfig('Institute'),
              },
              {
                navItemLink: {
                  documentId: '12334',
                  slug: 'someSlug',
                },
                navItemText: simpleRteConfig('Editionen'),
              },
              {
                navItemLink: {
                  documentId: '12334',
                  slug: 'someSlug',
                },
                navItemText: simpleRteConfig('Reisebeiträge'),
              },
              {
                navItemLink: {
                  documentId: '12334',
                  slug: 'someSlug',
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
                  documentId: '12334',
                  slug: 'someSlug',
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
                  documentId: '12334',
                  slug: 'someSlug',
                },
                navItemText: simpleRteConfig('Übersicht'),
              },
              {
                navItemLink: {
                  documentId: '12334',
                  slug: 'someSlug',
                },
                navItemText: simpleRteConfig('Magazin'),
              },
              {
                navItemLink: {
                  documentId: '12334',
                  slug: 'someSlug',
                },
                navItemText: simpleRteConfig('Publikationen'),
              },
              {
                navItemLink: {
                  documentId: '12334',
                  slug: 'someSlug',
                },
                navItemText: simpleRteConfig('Veranstaltungen'),
              },
              {
                navItemLink: {
                  documentId: '12334',
                  slug: 'someSlug',
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
                  documentId: '12334',
                  slug: 'someSlug',
                },
                navItemText: simpleRteConfig('Die SAGW'),
              },
              {
                navItemLink: {
                  documentId: '12334',
                  slug: 'someSlug',
                },
                navItemText: simpleRteConfig('Team'),
              },
              {
                navItemLink: {
                  documentId: '12334',
                  slug: 'someSlug',
                },
                navItemText: simpleRteConfig('Kontakt'),
              },
              {
                navItemLink: {
                  documentId: '12334',
                  slug: 'someSlug',
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

  // add status message
  await payload.create({
    collection: 'statusMessage',
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

  // add form item
  const form = await payload.create({
    collection: 'forms',
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
        title: simpleRteConfig(`Submit title success ${tenant.toUpperCase()}`),
      },
      subtitle: simpleRteConfig('Subtitle for contact Form'),
      tenant: tenantId,
      title: simpleRteConfig(`Contact Form ${tenant.toUpperCase()}`),
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
      },
      recipientMail: 'delivered@resend.dev',
      showPrivacyCheckbox: true,
      submitButtonLabel: 'Abschicken',
      submitError: {
        text: simpleRteConfig(`Newsletter Submit text error ${tenant.toUpperCase()}`),
        title: simpleRteConfig(`Newsletter Submit title error ${tenant.toUpperCase()}`),
      },
      submitSuccess: {
        text: simpleRteConfig(`Newsletter Submit text success ${tenant.toUpperCase()}`),
        title: simpleRteConfig(`Newsletter Submit title success ${tenant.toUpperCase()}`),
      },
      subtitle: simpleRteConfig(`Subtitle for Newsletter Form ${tenant.toUpperCase()}`),
      tenant: tenantId,
      title: simpleRteConfig(`Newsletter Form ${tenant.toUpperCase()}`),
    },
  });

  // add i18n data
  await payload.create({
    collection: 'i18nGlobals',
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
    data: {
      _status: 'published',
      content: [
        {
          blockType: 'formBlock',
          form,
        },
        {
          blockType: 'formBlock',
          form: newsletterForm,
        },
        // {
        //   blockType: 'notificationBlock',
        //   text: simpleRteConfig('Sample notification text.'),
        // },
        {
          blockType: 'eventsTeasersBlock',
          title: simpleRteConfig('Events'),
        },
        {
          blockType: 'newsTeasersBlock',
          colorMode: 'light',
          title: simpleRteConfig('News'),
        },
        {
          blockType: 'textBlock',
          text: rte4FullRange,
        },
        {
          blockType: 'textBlock',
          text: rte4FullRange,
        },
        // {
        //   accordions: [
        //     {
        //       accordionContent: simpleRteConfig('Some content'),
        //       accordionTitle: simpleRteConfig('Accordion 1'),
        //     },
        //     {
        //       accordionContent: simpleRteConfig('Some content'),
        //       accordionTitle: simpleRteConfig('Accordion 2'),
        //     },
        //     {
        //       accordionContent: simpleRteConfig('Some content'),
        //       accordionTitle: simpleRteConfig('Accordion 3'),
        //     },
        //     {
        //       accordionContent: simpleRteConfig('Some content'),
        //       accordionTitle: simpleRteConfig('Accordion 4'),
        //     },
        //     {
        //       accordionContent: simpleRteConfig('Some content'),
        //       accordionTitle: simpleRteConfig('Accordion 5'),
        //     },
        //   ],
        //   blockType: 'accordionBlock',
        //   colorMode: 'white',
        //   title: simpleRteConfig(`Accordion title ${tenant.toUpperCase()}`),
        //   titleLevel: '2',
        // },
      ],
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

  // create error page
  await payload.create({
    collection: 'errorPage',
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
      tenant: tenantId,
    },
  });

  // create impressum page
  await payload.create({
    collection: 'impressumPage',
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
      tenant: tenantId,
    },
  });

  // create data privacy page
  await payload.create({
    collection: 'dataPrivacyPage',
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
      tenant: tenantId,
    },
  });

  // create detail page
  const detailPage = await payload.create({
    collection: 'detailPage',
    data: {
      _status: 'published',
      content: [

        // links block
        {
          blockType: 'linksBlock',
          links: [
            {
              linkExternal: {
                description: simpleRteConfig('Offenes Repository für EU-finanzierte Forschungsergebnisse aus Horizon Europe, Euratom und früheren Rahmenprogrammen.'),
                externalLink: 'https://www.foo.bar',
                externalLinkText: simpleRteConfig('Artikel auf Zenodo'),
              },
              linkType: 'external',
            },
            {
              linkInternal: {
                internalLink: {
                  documentId: '12345',
                  slug: 'some-slug',
                },
                linkText: simpleRteConfig('Artikel auf Zenodo'),
              },
              linkType: 'internal',
            },
            {
              linkMail: {
                email: 'foo@bar.com',
                linkText: simpleRteConfig('Schreiben Sie eine E-Mail'),
              },
              linkType: 'mail',
            },
          ],
        },

        // downloads block
        {
          blockType: 'downloadsBlock',
          customOrAuto: 'custom',
          downloads: [
            {
              relationTo: 'documents',
              value: document.id,
            },
            {
              relationTo: 'zenodoDocuments',
              value: zenodoDocument.id,
            },
          ],
          subtitle: simpleRteConfig('Dieser Artikel ist Teil von folgender Bulletin-Ausgabe'),
        },

        // cta contact
        {
          blockType: 'ctaContactBlock',
          colorMode: 'dark',
          contact: [person.id],
          text: simpleRteConfig('Haben Sie Fragen? Dann melden Sie sich gerne bei uns.'),
          title: simpleRteConfig('Kontakt'),

        },
      ],
      hero: {
        colorMode: 'white',
        lead: simpleRteConfig('Detail Page Lead'),
        title: simpleRteConfig(`Detail page title ${tenant.toUpperCase()}`),
      },
      navigationTitle: 'Detail Page',
      slug: `detail-page-title-${tenant.toLocaleLowerCase()}`,
      tenant: tenantId,
    },
    draft: false,
  });

  // create draft detail page
  await payload.create({
    collection: 'detailPage',
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

  // create overview page
  await payload.create({
    collection: 'overviewPage',
    data: {
      _status: 'published',
      hero: {
        colorMode: 'white',
        lead: simpleRteConfig('Overview Page Lead'),
        title: simpleRteConfig(`Overview page title ${tenant.toUpperCase()}`),
      },
      navigationTitle: `Overview page title ${tenant.toUpperCase()}`,
      slug: `overview-page-title-${tenant.toLowerCase()}`,
      tenant: tenantId,
    },
    draft: false,
  });

  // create overview page with news overview block
  const newsOverview = await payload.create({
    collection: 'overviewPage',
    data: {
      _status: 'published',
      content: [
        {
          blockType: 'newsOverviewBlock',
          title: simpleRteConfig('All News'),
        },
      ],
      hero: {
        colorMode: 'white',
        lead: simpleRteConfig('Overview Page Lead'),
        title: simpleRteConfig(`News Overview ${tenant.toUpperCase()}`),
      },
      navigationTitle: 'News',
      slug: `overview-page-with-news-overview-${tenant.toLowerCase()}`,
      tenant: tenantId,
    },
    draft: false,
  });

  // create overview page with events overview block
  const eventsOverview = await payload.create({
    collection: 'overviewPage',
    data: {
      _status: 'published',
      content: [
        {
          blockType: 'eventsOverviewBlock',
          title: simpleRteConfig('All Events'),
        },
      ],
      hero: {
        colorMode: 'white',
        lead: simpleRteConfig('Overview Page Lead'),
        title: simpleRteConfig(`Events Overview ${tenant.toUpperCase()}`),
      },
      navigationTitle: 'Events',
      slug: `overview-page-with-events-overview-${tenant.toLowerCase()}`,
      tenant: tenantId,
    },
    draft: false,
  });

  // create overview page with editions overview block
  await payload.create({
    collection: 'overviewPage',
    data: {
      _status: 'published',
      content: [
        {
          blockType: 'editionsOverview',
          items: {
            items: Array.from({
              length: 22,
            }, (_, i) => {
              const index = i + 1;

              return {
                externalLink: 'https://www.foo.bar',
                text: simpleRteConfig('Editions text'),
                title: simpleRteConfig(`Edition ${index}`),
              };
            }),
            linkText: simpleRteConfig('foo'),
          },
        },
      ],
      hero: {
        colorMode: 'light',
        title: simpleRteConfig('Editions overview'),
      },
      navigationTitle: 'Editionen',
      slug: `editions-overview-${tenant.toLowerCase()}`,
      tenant: tenantId,
    },
  });

  // create overview page with institutes overview block
  await payload.create({
    collection: 'overviewPage',
    data: {
      _status: 'published',
      content: [
        {
          blockType: 'institutesOverviewBlock',
          moreInfoButtonText: simpleRteConfig('Mehr erfahren'),
        },
      ],
      hero: {
        colorMode: 'light',
        title: simpleRteConfig('Institutes overview'),
      },
      navigationTitle: 'Institutes',
      slug: `institutes-overview-${tenant.toLowerCase()}`,
      tenant: tenantId,
    },
  });

  // create overview page with magazine overview block
  await payload.create({
    collection: 'overviewPage',
    data: {
      _status: 'published',
      content: [
        {
          blockType: 'magazineOverviewBlock',
        },
      ],
      hero: {
        colorMode: 'light',
        title: simpleRteConfig('Magazine overview'),
      },
      navigationTitle: 'Magazine overview',
      slug: `magazine-overview-${tenant.toLowerCase()}`,
      tenant: tenantId,
    },
  });

  // create overview page with National Dictionary overview block
  await payload.create({
    collection: 'overviewPage',
    data: {
      _status: 'published',
      content: [
        {
          blockType: 'nationalDictionariesOverviewBlock',
          moreInfoButtonText: simpleRteConfig('Weitere Informationen'),
        },
      ],
      hero: {
        colorMode: 'light',
        title: simpleRteConfig('National Dictionaries overview'),
      },
      navigationTitle: 'National Dictionaries overview',
      slug: `national-dictionaries-overview-${tenant.toLowerCase()}`,
      tenant: tenantId,
    },
  });

  // create overview page with Network teasers overview block
  const networkTeaserItems = (): InterfaceNetworkTeaserPropTypes['items']['items'] => {
    const items = [];

    for (let i = 0; i < 22; i++) {
      const randomCategory = networkCategories[Math.floor(Math.random() * networkCategories.length)];

      items.push({
        category: randomCategory.id,
        externalLink: 'https://www.foo.bar',
        foundingYear: 1983,
        image: image.id,
        title: simpleRteConfig(`Network item ${i.toString()}`),
      });
    }

    return items;
  };

  await payload.create({
    collection: 'overviewPage',
    data: {
      _status: 'published',
      content: [
        {
          blockType: 'networkTeasersBlock',
          filter: {
            allCheckboxText: simpleRteConfig('Alle Fachgesellschaften'),
            title: simpleRteConfig('Fachgesellschaften'),
          },
          items: {
            foundingYearText: simpleRteConfig('Gründungsjahr'),
            items: networkTeaserItems(),
            linkText: simpleRteConfig('Öffnen'),
          },
        },
      ],
      hero: {
        colorMode: 'light',
        title: simpleRteConfig('Network overview'),
      },
      navigationTitle: 'Network overview',
      slug: `network-overview-${tenant.toLowerCase()}`,
      tenant: tenantId,
    },
  });

  // create overview page with People overview block
  await payload.create({
    collection: 'overviewPage',
    data: {
      _status: 'published',
      content: [
        {
          blockType: 'peopleOverviewBlock',
          teams: team.id,
        },
      ],
      hero: {
        colorMode: 'light',
        title: simpleRteConfig('People overview'),
      },
      navigationTitle: 'People overview',
      slug: `people-overview-${tenant.toLowerCase()}`,
      tenant: tenantId,
    },
  });

  // create overview page with Projects overview block
  await payload.create({
    collection: 'overviewPage',
    data: {
      _status: 'published',
      content: [
        {
          blockType: 'projectsOverviewBlock',
        },
      ],
      hero: {
        colorMode: 'light',
        title: simpleRteConfig('Projects overview'),
      },
      navigationTitle: 'Projects overview',
      slug: `projects-overview-${tenant.toLowerCase()}`,
      tenant: tenantId,
    },
  });

  // create overview page with teasers
  await payload.create({
    collection: 'overviewPage',
    data: {
      _status: 'published',
      content: [
        // generic teaser
        {
          alignement: 'horizontal',
          blockType: 'genericTeasersBlock',
          lead: simpleRteConfig('Lead'),
          teasers: [
            {
              image: {
                relationTo: 'images',
                value: image.id,
              },
              linkExternal: {
                externalLink: 'https://www.foo.bar',
                externalLinkText: simpleRteConfig('Link'),
              },
              linkType: 'external',
              text: simpleRteConfig('Generic Teaser text'),
              title: simpleRteConfig('Generic Teaser 1'),
            },
            {
              image: {
                relationTo: 'images',
                value: image.id,
              },
              linkExternal: {
                externalLink: 'https://www.foo.bar',
                externalLinkText: simpleRteConfig('Link'),
              },
              linkType: 'external',
              text: simpleRteConfig('Generic Teaser text'),
              title: simpleRteConfig('Generic Teaser 2'),
            },
          ],
          title: simpleRteConfig('Generic Teaser'),
        },

        // projects teaser
        {
          alignement: 'vertical',
          blockType: 'projectsTeasersBlock',
          lead: simpleRteConfig('Lead'),
          title: simpleRteConfig('Project Teaser'),
        },

        // publications teaser
        // {
        //   blockType: 'publicationsTeasersBlock',
        //   link: 'yes',
        //   linkText: simpleRteConfig('Link'),
        //   title: simpleRteConfig('Project Teaser'),
        // },

        // magazine teaser
        {
          alignement: 'horizontal',
          blockType: 'magazineTeasersBlock',
          lead: simpleRteConfig('Lead'),
          title: simpleRteConfig('Magazine Teaser'),
        },
      ],
      hero: {
        colorMode: 'white',
        lead: simpleRteConfig('Lead'),
        title: simpleRteConfig(`Overview page with Teasers ${tenant.toUpperCase()}`),
      },
      navigationTitle: 'Teasers Overview',
      slug: `teasers-overview-page-${tenant.toLowerCase()}`,
      tenant: tenantId,
    },
    draft: false,
  });

  // create magazine detail pages
  await Promise.all(Array.from({
    length: 12,
  }, (_, i) => {
    const index = i + 1;

    return payload.create({
      collection: 'magazineDetailPage',
      data: {
        _status: 'published',
        content: [
          {
            alignement: 'center',
            blockType: 'imageBlock',
            credits: simpleRteConfig('some credits'),
            image: image.id,
          },
          {
            blockType: 'footnoteBlock',
            text: sampleFootnoteContent,
            title: simpleRteConfig('Footnote'),
          },
        ],
        hero: {
          author: simpleRteConfig('Author'),
          colorMode: 'white',
          date: `2030-08-${index < 10
            ? `0${index}`
            : index}T12:00:00.000Z`,
          lead: simpleRteConfig('Magazine Detail Page Lead'),
          title: simpleRteConfig(`Magazine detail page ${index} ${tenant.toUpperCase()}`),
        },
        navigationTitle: `Article ${index}`,
        overviewPageProps: {
          teaserText: simpleRteConfig('Magazine Detail Teaser Text'),
        },
        slug: `magazine-detail-page-${tenant.toLowerCase()}-${index}`,
        tenant: tenantId,
      },
    });
  }));

  // event detail pages (render detail Page)
  await Promise.all(Array.from({
    length: 12,
  }, (_, i) => {
    const index = i + 1;

    return payload.create({
      collection: 'eventDetailPage',
      data: {
        _status: 'published',
        blocks: {
          content: [

            // cta link block internal link
            {
              blockType: 'ctaLinkBlock',
              linkInternal: {
                internalLink: {
                  documentId: detailPage.id,
                  slug: 'some-slug',
                },
                linkText: simpleRteConfig('Internal Link Text (internal)'),
              },
              linkType: 'internal',
              text: simpleRteConfig('CTA Link Block Text (internal)'),
              title: simpleRteConfig('CTA Link Block Title (internal)'),

            },

            // cta link block external link
            {
              blockType: 'ctaLinkBlock',
              linkExternal: {
                externalLink: 'https://www.foo.bar',
                externalLinkText: simpleRteConfig('External Link Text (external)'),
              },
              linkType: 'external',
              text: simpleRteConfig('CTA Link Block Text (external)'),
              title: simpleRteConfig('CTA Link Block Title (external)'),

            },

            // cta link block mail link
            {
              blockType: 'ctaLinkBlock',
              linkMail: {
                email: 'foo@bar.com',
                linkText: simpleRteConfig('Mail link'),
              },
              linkType: 'mail',
              text: simpleRteConfig('CTA Link Block Text (mail)'),
              title: simpleRteConfig('CTA Link Block Title (mail)'),

            },
          ],
        },
        eventDetails: {
          category: eventCategory.id,
          date: `2030-08-${index < 10
            ? `0${index}`
            : index}T12:00:00.000Z`,
          dateEnd: `2026-01-${index < 10
            ? `0${index}`
            : index}T12:00:00.000Z`,
          language: simpleRteConfig('Deutsch'),
          location: simpleRteConfig('ETH Zürich'),
          project: project.id,
          time: '2025-08-31T12:00:00.000Z',
          title: simpleRteConfig(`Event ${index} details title ${tenant.toUpperCase()} (render detail page)`),
        },
        navigationTitle: 'Event',
        parentPage: {
          documentId: eventsOverview.id,
          slug: 'overviewPage',
        },
        showDetailPage: 'true',
        slug: `event-${index}-details-title-${tenant.toLocaleLowerCase()}-render-detail-page`,
        tenant: tenantId,
      },
      draft: false,
    });
  }));

  // event detail page (render link)
  await Promise.all(Array.from({
    length: 12,
  }, (_, i) => {
    const index = 12 + i + 1;

    return payload.create({
      collection: 'eventDetailPage',
      data: {
        _status: 'published',
        eventDetails: {
          category: eventCategory.id,
          date: `2030-08-${index < 10
            ? `0${index}`
            : index}T12:00:00.000Z`,
          project: project.id,
          title: simpleRteConfig(`Event ${index} detail title ${tenant.toUpperCase()} (render link)`),
        },
        link: {
          externalLink: 'https://www.foo.bar',
        },
        navigationTitle: 'Event',
        parentPage: {
          documentId: eventsOverview.id,
          slug: 'overviewPage',
        },
        showDetailPage: 'false',
        slug: `event-${index}-details-title-${tenant.toLocaleLowerCase()}-render-link`,
        tenant: tenantId,
      },
      draft: false,
    });
  }));

  // news detail pages
  await Promise.all(Array.from({
    length: 25,
  }, (_, i) => {
    const index = i + 1;

    return payload.create({
      collection: 'newsDetailPage',
      data: {
        _status: 'published',
        hero: {
          colorMode: 'white',
          date: `2025-08-${index < 10
            ? `0${index}`
            : index}T12:00:00.000Z`,
          lead: simpleRteConfig(`News ${index} Detail Page Lead`),
          title: simpleRteConfig(`News ${index} detail page title ${tenant.toUpperCase()}`),
        },
        navigationTitle: 'News Page',
        overviewPageProps: {
          teaserText: simpleRteConfig(`Overview Teaser Text from News ${index}`),
        },
        parentPage: {
          documentId: newsOverview.id,
          slug: 'overviewPage',
        },
        project: project.id,
        slug: `news-${index}-detail-page-title-${tenant.toLowerCase()}`,
        tenant: tenantId,
      },
      draft: false,
    });
  }));

  // publication detail pages
  await Promise.all(Array.from({
    length: 12,
  }, (_, i) => {
    const index = i + 1;

    return payload.create({
      collection: 'publicationDetailPage',
      data: {
        _status: 'published',
        categorization: {
          topic: publicationTopic.id,
          type: publicationType.id,
        },
        content: [
          {
            blockType: 'bibliographicReferenceBlock',
            text: simpleRteConfig('Duchêne, Cédric, Marieke Heers and Laura Bernardi (2025): All-day childcare and schooling. A survey of parental attitudes in Switzerland, ed. by the Swiss Academy of Humanities and Social Sciences (Swiss Academies Reports 20,1). https://doi.org/10.5281/zenodo.14283689'),
          },
        ],
        hero: {
          colorMode: 'white',
          lead: simpleRteConfig('Publication Detail Page Lead'),
          title: simpleRteConfig(`Publication detail page ${index} ${tenant.toUpperCase()}`),
        },
        navigationTitle: `Publication ${index}`,
        overviewPageProps: {
          date: '2025-08-31T12:00:00.000Z',
          image,
        },
        slug: `publication-detail-page-title-${tenant.toLowerCase()}-${index}`,
        tenant: tenantId,
      },
    });
  }));

  // institute detail page
  await Promise.all(Array.from({
    length: 12,
  }, (_, i) => {
    const index = i + 1;

    return payload.create({
      collection: 'instituteDetailPage',
      data: {
        _status: 'published',
        hero: {
          colorMode: 'white',
          lead: simpleRteConfig('Institute Detail Page Lead'),
          title: simpleRteConfig(`Institute detail page title ${index} ${tenant.toUpperCase()}`),
        },
        navigationTitle: 'Institute',
        overviewPageProps: {
          image,
          teaserText: simpleRteConfig(`Institute Teaser Text ${index}`),
        },
        slug: `institute-detail-page-title-${tenant.toUpperCase()}-${index}`,
        tenant: tenantId,
      },
    });
  }));

  // national dictionary detail page
  await Promise.all(Array.from({
    length: 12,
  }, (_, i) => {
    const index = i + 1;

    return payload.create({
      collection: 'nationalDictionaryDetailPage',
      data: {
        _status: 'published',
        hero: {
          colorMode: 'white',
          lead: simpleRteConfig('National Dictionary Detail Page Lead'),
          title: simpleRteConfig(`National Dictionary detail page ${index} title ${tenant.toUpperCase()}`),
        },
        navigationTitle: `National Dictionary Detail ${index}`,
        overviewPageProps: {
          image,
          teaserText: simpleRteConfig('National Dictionary Teaser Text'),
        },
        slug: `national-dictionary-detail-${index}-${tenant.toLowerCase()}`,
        tenant: tenantId,
      },
    });
  }));

  // project detail pages
  await Promise.all(Array.from({
    length: 12,
  }, (_, i) => {
    const index = i + 1;

    return payload.create({
      collection: 'projectDetailPage',
      data: {
        _status: 'published',
        hero: {
          colorMode: 'white',
          lead: simpleRteConfig('Project Detail Page Lead'),
          title: simpleRteConfig(`Project detail page ${index} ${tenant.toUpperCase()}`),
        },
        navigationTitle: `Project Detail ${index}`,
        overviewPageProps: {
          linkText: simpleRteConfig('some text'),
          teaserText: simpleRteConfig('Project Teaser Text'),
        },
        project,
        slug: `project-detail-page-title${tenant.toLowerCase()}-${index}`,
        tenant: tenantId,
      },
    });
  }));

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
