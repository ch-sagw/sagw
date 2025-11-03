/* eslint-disable @typescript-eslint/naming-convention */

import { Payload } from 'payload';

import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  rte3ConsentBannerText, rte3FullRange,
} from '@/utilities/rteSampleContent';
import { tenantRoles } from '@/collections/Plc/Users/roles';

export const addDataForTenant = async (payload: Payload, tenant: string): Promise<void> => {

  // ############
  // Tenant & User
  // ############

  // create tenant
  const tenantId = await payload.create({
    collection: 'tenants',
    data: {
      languages: {
        de: true,
        en: true,
        fr: true,
        it: true,
      },
      name: tenant.toLocaleUpperCase(),
      slug: tenant,
    },
  });

  // create user
  if (process.env.PAYLOAD_INITIAL_USER_MAIL) {
    await payload.create({
      collection: 'users',
      data: {
        email: tenant === 'sagw'
          ? process.env.PAYLOAD_INITIAL_USER_MAIL
          : `${tenant}@foo.bar`,
        password: process.env.PAYLOAD_INITIAL_PASSWORD,
        tenants: [
          {
            roles: [tenantRoles.admin],
            tenant: tenantId,
          },
        ],
        username: `${tenant}-admin`,
      },
    });
  }

  // ############
  // Assets
  // ############

  // add image
  const image = await payload.create({
    collection: 'images',
    data: {
      alt: `${tenant.toUpperCase} image`,
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

  // create network category
  await payload.create({
    collection: 'networkCategories',
    data: {
      name: simpleRteConfig(`Network Category 1 ${tenant.toUpperCase()}`),
      tenant: tenantId,
    },
  });

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
  const person = await payload.create({
    collection: 'people',
    data: {
      firstname: simpleRteConfig(`Firstname ${tenant.toUpperCase()}`),
      function: simpleRteConfig('Some function'),
      lastname: simpleRteConfig(`Lastname ${tenant.toUpperCase()}`),
      mail: simpleRteConfig('foo@bar.com'),
      phone: simpleRteConfig('031 123 45 67'),
      tenant: tenantId,
    },
  });

  // create a team
  await payload.create({
    collection: 'teams',
    data: {
      name: simpleRteConfig(`Team 1 ${tenant.toUpperCase()}`),
      people: [person.id],
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
            navItemLink: '/',
            navItemText: simpleRteConfig('Home'),
          },
          {
            description: simpleRteConfig('Förderung von langfristigen Forschungsinfrastrukturen'),
            navItemText: simpleRteConfig('Förderung'),
            subNavItems: [
              {
                navItemLink: '/',
                navItemText: simpleRteConfig('Übersicht'),
              },
              {
                navItemLink: '/',
                navItemText: simpleRteConfig('Institute'),
              },
              {
                navItemLink: '/',
                navItemText: simpleRteConfig('Editionen'),
              },
              {
                navItemLink: '/',
                navItemText: simpleRteConfig('Reisebeiträge'),
              },
              {
                navItemLink: '/',
                navItemText: simpleRteConfig('Early Career Award'),
              },
            ],
          },
          {
            description: simpleRteConfig('Unsere 63 Fachgesellschaften unter einem Dach'),
            navItemText: simpleRteConfig('Netzwerk'),
            subNavItems: [
              {
                navItemLink: '/',
                navItemText: simpleRteConfig('Fachgesellschaften'),
              },
            ],
          },
          {
            description: simpleRteConfig('Vermittlung von Wissen zwischen Wissenschaft und Gesellschaft'),
            navItemText: simpleRteConfig('Aktivitäten'),
            subNavItems: [
              {
                navItemLink: '/',
                navItemText: simpleRteConfig('Übersicht'),
              },
              {
                navItemLink: '/',
                navItemText: simpleRteConfig('Magazin'),
              },
              {
                navItemLink: '/',
                navItemText: simpleRteConfig('Publikationen'),
              },
              {
                navItemLink: '/',
                navItemText: simpleRteConfig('Veranstaltungen'),
              },
              {
                navItemLink: '/',
                navItemText: simpleRteConfig('News'),
              },
            ],
          },
          {
            description: simpleRteConfig('Alles Wissenswertes über die SAGW'),
            navItemText: simpleRteConfig('Über uns'),
            subNavItems: [
              {
                navItemLink: '/',
                navItemText: simpleRteConfig('Die SAGW'),
              },
              {
                navItemLink: '/',
                navItemText: simpleRteConfig('Team'),
              },
              {
                navItemLink: '/',
                navItemText: simpleRteConfig('Kontakt'),
              },
              {
                navItemLink: '/',
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
      message: simpleRteConfig(`Status Message ${tenant.toUpperCase()}`),
      show: {
        display: 'hide',
      },
      tenant: tenantId,
      title: simpleRteConfig(`Status Title ${tenant.toUpperCase()}`),
      type: 'error',
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
        text: simpleRteConfig(`Submit text error ${tenant.toUpperCase()}`),
        title: simpleRteConfig(`Submit title error ${tenant.toUpperCase()}`),
      },
      submitSuccess: {
        text: simpleRteConfig(`Submit text success ${tenant.toUpperCase()}`),
        title: simpleRteConfig(`Submit title success ${tenant.toUpperCase()}`),
      },
      subtitle: simpleRteConfig(`Subtitle for contact Form ${tenant.toUpperCase()}`),
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
          fieldWidth: 'half',
          label: simpleRteConfig('E-Mail'),
          placeholder: 'Ihre E-Mail Adresse',
        },
        includeLanguageSelection: 'yes',
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
          linkText: simpleRteConfig('Alle events'),
          title: simpleRteConfig('Events'),
        },
        {
          blockType: 'newsTeasersBlock',
          linkText: simpleRteConfig('Alle News'),
          title: simpleRteConfig('News'),
        },
        {
          blockType: 'textBlock',
          text: rte3FullRange,
        },
        {
          blockType: 'textBlock',
          text: rte3FullRange,
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
                internalLink: 'https://www.foo.bar',
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
          optionalLink: {
            includeLink: true,
            link: {
              internalLink: `homePage/${home.id}`,
              linkText: simpleRteConfig('Alle Downloads'),
            },
          },
          subtitle: simpleRteConfig('Dieser Artikel ist Teil von folgender Bulletin-Ausgabe'),
        },
      ],
      hero: {
        colorMode: 'white',
        lead: simpleRteConfig('Detail Page Lead'),
        title: simpleRteConfig(`Detail page title ${tenant.toUpperCase()}`),
      },
      tenant: tenantId,
    },
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
      tenant: tenantId,
    },
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
      tenant: tenantId,
    },
  });

  // create overview page with news overview block
  await payload.create({
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
        title: simpleRteConfig(`Overview page with News Overview ${tenant.toUpperCase()}`),
      },
      tenant: tenantId,
    },
  });

  // create overview page with events overview block
  await payload.create({
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
        title: simpleRteConfig(`Overview page with Events Overview ${tenant.toUpperCase()}`),
      },
      tenant: tenantId,
    },
  });

  // create magazine detail page
  await payload.create({
    collection: 'magazineDetailPage',
    data: {
      _status: 'published',
      hero: {
        author: simpleRteConfig('Author'),
        colorMode: 'white',
        date: '2025-08-31T12:00:00.000Z',
        lead: simpleRteConfig('Magazine Detail Page Lead'),
        title: simpleRteConfig(`Magazine detail page title ${tenant.toUpperCase()}`),
      },
      overviewPageProps: {
        teaserText: simpleRteConfig('Magazine Detail Teaser Text'),
      },
      tenant: tenantId,
    },
  });

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
                internalLink: `detailPage/${detailPage.id}`,
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
        showDetailPage: 'true',
        tenant: tenantId,
      },
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
        showDetailPage: 'false',
        tenant: tenantId,
      },
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
        overviewPageProps: {
          teaserText: simpleRteConfig(`Overview Teaser Text from News ${index}`),
        },
        project: project.id,
        tenant: tenantId,
      },
    });
  }));

  // publication detail page
  await payload.create({
    collection: 'publicationDetailPage',
    data: {
      _status: 'published',
      categorization: {
        topic: publicationTopic.id,
        type: publicationType.id,
      },
      hero: {
        colorMode: 'white',
        lead: simpleRteConfig('Publication Detail Page Lead'),
        title: simpleRteConfig(`Publication detail page title ${tenant.toUpperCase()}`),
      },
      overviewPageProps: {
        date: '2025-08-31T12:00:00.000Z',
        image,
      },
      tenant: tenantId,
    },
  });

  // institute detail page
  await payload.create({
    collection: 'instituteDetailPage',
    data: {
      _status: 'published',
      hero: {
        colorMode: 'white',
        lead: simpleRteConfig('Institute Detail Page Lead'),
        title: simpleRteConfig(`Institute detail page title ${tenant.toUpperCase()}`),
      },
      overviewPageProps: {
        image,
        teaserText: simpleRteConfig('Institute Teaser Text'),
      },
      tenant: tenantId,
    },
  });

  // national dictionary detail page
  await payload.create({
    collection: 'nationalDictionaryDetailPage',
    data: {
      _status: 'published',
      hero: {
        colorMode: 'white',
        lead: simpleRteConfig('National Dictionary Detail Page Lead'),
        title: simpleRteConfig(`National Dictionary detail page title ${tenant.toUpperCase()}`),
      },
      overviewPageProps: {
        image,
        teaserText: simpleRteConfig('National Dictionary Teaser Text'),
      },
      tenant: tenantId,
    },
  });

  // project detail page
  await payload.create({
    collection: 'projectDetailPage',
    data: {
      _status: 'published',
      hero: {
        colorMode: 'white',
        lead: simpleRteConfig('Project Detail Page Lead'),
        title: simpleRteConfig(`Project detail page title ${tenant.toUpperCase()}`),
      },
      overviewPageProps: {
        teaserText: simpleRteConfig('Project Teaser Text'),
      },
      project,
      tenant: tenantId,
    },
  });

  // add consent data
  await payload.create({
    collection: 'consent',
    data: {
      banner: {
        buttonAcceptAll: simpleRteConfig('Alle zulassen'),
        buttonCustomizeSelection: simpleRteConfig('Auswahl anpassen'),
        buttonDeclineAll: simpleRteConfig('Alle ablehnen'),
        text: rte3ConsentBannerText(home.id),
        title: simpleRteConfig('Diese Webseite verwendet Cookies'),
      },
      overlay: {
        analyticsPerformance: {
          text: simpleRteConfig('Diese Gruppe beinhaltet alle Cookies von Skripts für analytisches Tracking. Die Analysen helfen uns, die Nutzer*innenerfahrung der Website zu verbessern.'),
          title: simpleRteConfig('Analytics und Performance'),
          toggleLabelOff: simpleRteConfig('Aus'),
          toggleLabelOn: simpleRteConfig('An'),
        },
        buttonAcceptAll: simpleRteConfig('Alle zulassen'),
        buttonAcceptSelection: simpleRteConfig('Auswahl zulassen'),
        externalContent: {
          text: simpleRteConfig('Externe Inhalte umfassen Cookies, die von Drittanbietern gesetzt werden, damit wir auf unserer Website Inhalte von deren Plattform bereitstellen können (wie z.B. Videos oder Social Media Feeds).'),
          title: simpleRteConfig('Externe Inhalte'),
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
