/* eslint-disable @typescript-eslint/naming-convention */

import { Payload } from 'payload';

import { simpleRteConfig } from '@/utilities/simpleRteConfig';
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
      _status: 'published',
      alt: `${tenant.toUpperCase} image`,
      tenant: tenantId,
    },
    filePath: `src/seed/test-data/assets/${tenant}.png`,
  });

  // add svg
  await payload.create({
    collection: 'svgs',
    data: {
      _status: 'published',
      name: `${tenant.toUpperCase()} SVG`,
      tenant: tenantId,
    },
    filePath: `src/seed/test-data/assets/${tenant}.svg`,
  });

  // add video
  await payload.create({
    collection: 'videos',
    data: {
      _status: 'published',
      tenant: tenantId,
      title: `video ${tenant}`,
    },
    filePath: `src/seed/test-data/assets/${tenant}.mp4`,
  });

  // add document
  await payload.create({
    collection: 'documents',
    data: {
      _status: 'published',
      date: '2025-10-30',
      tenant: tenantId,
      title: simpleRteConfig(`${tenant.toUpperCase()} Document`),
    },
    filePath: `src/seed/test-data/assets/${tenant}.pdf`,
  });

  // add zenodo document
  await payload.create({
    collection: 'zenodoDocuments',
    data: {
      _status: 'published',
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
        _status: 'published',
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
      _status: 'published',
      publicationTopic: simpleRteConfig(`Publication Topic 1 ${tenant.toUpperCase()}`),
      tenant: tenantId,
    },
  });

  // create publication type
  const publicationType = await payload.create({
    collection: 'publicationTypes',
    data: {
      _status: 'published',
      publicationType: simpleRteConfig(`Publication Type 1 ${tenant.toUpperCase()}`),
      tenant: tenantId,
    },
  });

  // create network category
  await payload.create({
    collection: 'networkCategories',
    data: {
      _status: 'published',
      name: simpleRteConfig(`Network Category 1 ${tenant.toUpperCase()}`),
      tenant: tenantId,
    },
  });

  // create project
  const project = await payload.create({
    collection: 'projects',
    data: {
      _status: 'published',
      name: simpleRteConfig(`Project 1 ${tenant.toUpperCase()}`),
      tenant: tenantId,
    },
  });

  // create a team
  const team = await payload.create({
    collection: 'teams',
    data: {
      _status: 'published',
      name: simpleRteConfig(`Team 1 ${tenant.toUpperCase()}`),
      tenant: tenantId,
    },
  });

  // create person in people
  await payload.create({
    collection: 'people',
    data: {
      _status: 'published',
      firstname: simpleRteConfig(`Firstname ${tenant.toUpperCase()}`),
      function: simpleRteConfig('Some function'),
      lastname: simpleRteConfig(`Lastname ${tenant.toUpperCase()}`),
      mail: simpleRteConfig('foo@bar.com'),
      name: simpleRteConfig(`Name ${tenant.toUpperCase()}`),
      phone: simpleRteConfig('031 123 45 67'),
      team: [team],
      tenant: tenantId,
    },
  });

  // create event category
  const eventCategory = await payload.create({
    collection: 'eventCategory',
    data: {
      _status: 'published',
      eventCategory: simpleRteConfig(`Event Category 1 ${tenant.toUpperCase()}`),
      tenant: tenantId,
    },
  });

  // add consent data
  await payload.create({
    collection: 'consent',
    data: {
      _status: 'published',
      banner: {
        buttonAcceptAll: simpleRteConfig(`Accept all ${tenant.toUpperCase()}`),
        buttonCustomizeSelection: simpleRteConfig(`Customize ${tenant.toUpperCase()}`),
        buttonDeclineAll: simpleRteConfig(`Decline ${tenant.toUpperCase()}`),
        text: simpleRteConfig(`Text ${tenant.toUpperCase()}`),
        title: simpleRteConfig(`Title ${tenant.toUpperCase()}`),
      },
      overlay: {
        analyticsPerformance: {
          text: simpleRteConfig(`Text ${tenant.toUpperCase()}`),
          title: simpleRteConfig(`Title ${tenant.toUpperCase()}`),
          toggleLabelOff: simpleRteConfig(`Toggle Off ${tenant.toUpperCase()}`),
          toggleLabelOn: simpleRteConfig(`Toggle On ${tenant.toUpperCase()}`),
        },
        buttonAcceptAll: simpleRteConfig(`Accept all ${tenant.toUpperCase()}`),
        buttonAcceptSelection: simpleRteConfig(`Accept selection ${tenant.toUpperCase()}`),
        externalContent: {
          text: simpleRteConfig(`Text ${tenant.toUpperCase()}`),
          title: simpleRteConfig(`Title ${tenant.toUpperCase()}`),
          toggleLabelOff: simpleRteConfig(`Toggle off ${tenant.toUpperCase()}`),
          toggleLabelOn: simpleRteConfig(`Toggle on ${tenant.toUpperCase()}`),
        },
        necessaryCookies: {
          text: simpleRteConfig(`Text ${tenant.toUpperCase()}`),
          title: simpleRteConfig(`Title ${tenant.toUpperCase()}`),
          toggleLabel: simpleRteConfig(`Toggle label ${tenant.toUpperCase()}`),
        },
        text: simpleRteConfig(`Text ${tenant.toUpperCase()}`),
        title: simpleRteConfig(`Title ${tenant.toUpperCase()}`),

      },
      tenant: tenantId,
    },
  });

  // add footer data
  await payload.create({
    collection: 'footer',
    data: {
      _status: 'published',
      contact: {
        address1: simpleRteConfig(`Address 1 ${tenant.toUpperCase()}`),
        address2: simpleRteConfig(`Address 2 ${tenant.toUpperCase()}`),
        city: simpleRteConfig(`City ${tenant.toUpperCase()}`),
        countryCode: simpleRteConfig(`Country Code ${tenant.toUpperCase()}`),
        mail: simpleRteConfig('foo@bar.baz'),
        phone: simpleRteConfig('031 123 45 67'),
        poBox: simpleRteConfig(`PoBox ${tenant.toUpperCase()}`),
        title: simpleRteConfig(`Title ${tenant.toUpperCase()}`),
        zipCode: simpleRteConfig(`Zip ${tenant.toUpperCase()}`),
      },
      copyright: simpleRteConfig(`Copyright ${tenant.toUpperCase()}`),
      impressum: simpleRteConfig(`Impressum ${tenant.toUpperCase()}`),
      legal: simpleRteConfig(`Legal ${tenant.toUpperCase()}`),
      tenant: tenantId,
    },
  });

  // add header data
  await payload.create({
    collection: 'header',
    data: {
      _status: 'published',
      languageNavigation: {
        description: simpleRteConfig('Die SAGW Webseite ist in vier Sprachen verfügbar'),
        title: simpleRteConfig('Sprachen'),
      },
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
      _status: 'published',
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
      _status: 'published',
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
      titleLevel: '2',
    },
  });

  // add newsletter form
  const newsletterForm = await payload.create({
    collection: 'forms',
    data: {
      _status: 'published',
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
        name: {
          fieldError: simpleRteConfig('Bitte geben Sie Ihren Namen an.'),
          fieldWidth: 'half',
          label: simpleRteConfig('Name'),
          placeholder: 'Ihr Name',
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
      titleLevel: '2',
    },
  });

  // add i18n data
  await payload.create({
    collection: 'i18nGlobals',
    data: {
      _status: 'published',
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
        writeEmailButtonText: simpleRteConfig('Write email button text'),
      },
      tenant: tenantId,
    },

  });

  // ############
  // Pages
  // ############

  // create home
  await payload.create({
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
        {
          blockType: 'notificationBlock',
          text: simpleRteConfig('Sample notification text.'),
        },
        {
          blockType: 'textBlock',
          text: simpleRteConfig('Sample Rte Block Content 1.'),
        },
        {
          blockType: 'textBlock',
          text: simpleRteConfig('Sample Rte Block Content 2.'),
        },
        {
          accordions: [
            {
              accordionContent: simpleRteConfig('Some content'),
              accordionTitle: simpleRteConfig('Accordion 1'),
            },
            {
              accordionContent: simpleRteConfig('Some content'),
              accordionTitle: simpleRteConfig('Accordion 2'),
            },
            {
              accordionContent: simpleRteConfig('Some content'),
              accordionTitle: simpleRteConfig('Accordion 3'),
            },
            {
              accordionContent: simpleRteConfig('Some content'),
              accordionTitle: simpleRteConfig('Accordion 4'),
            },
            {
              accordionContent: simpleRteConfig('Some content'),
              accordionTitle: simpleRteConfig('Accordion 5'),
            },
          ],
          blockType: 'accordionBlock',
          colorMode: 'white',
          title: simpleRteConfig(`Accordion main title ${tenant.toUpperCase()}`),
          titleLevel: '2',
        },
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
      homeButtonText: simpleRteConfig('Home Button Text'),
      notFound: {
        description: simpleRteConfig('Error description'),
        title: simpleRteConfig(`Not found title ${tenant.toUpperCase()}`),
      },
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
  await payload.create({
    collection: 'detailPage',
    data: {
      _status: 'published',
      hero: {
        colorMode: 'white',
        lead: simpleRteConfig('Detail Page Lead'),
        title: simpleRteConfig(`Detail page title ${tenant.toUpperCase()}`),
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

  // event detail page (render detail Page)
  await payload.create({
    collection: 'eventDetailPage',
    data: {
      _status: 'published',
      eventDetails: {
        category: eventCategory.id,
        date: '2025-08-31T12:00:00.000Z',
        project: project.id,
        title: simpleRteConfig(`Event details title ${tenant.toUpperCase()} (render detail page)`),
      },
      hero: {
        colorMode: 'white',
        lead: simpleRteConfig('Event Detail Page Lead'),
        title: simpleRteConfig(`Event detail page title ${tenant.toUpperCase()} (render detail page)`),
      },
      showDetailPage: 'true',
      tenant: tenantId,
    },
  });

  // event detail page (render detail Page)
  await payload.create({
    collection: 'eventDetailPage',
    data: {
      _status: 'published',
      eventDetails: {
        category: eventCategory.id,
        date: '2025-08-31T12:00:00.000Z',
        project: project.id,
        title: simpleRteConfig(`Event detail title ${tenant.toUpperCase()} (render link)`),
      },
      hero: {
        colorMode: 'white',
        title: simpleRteConfig(`Event detail page title ${tenant.toUpperCase()} (render link)`),
      },
      link: {
        externalLink: 'https://www.foo.bar',
        externalLinkText: simpleRteConfig('External Link'),
      },
      showDetailPage: 'false',
      tenant: tenantId,
    },
  });

  // news detail page
  await payload.create({
    collection: 'newsDetailPage',
    data: {
      _status: 'published',
      hero: {
        colorMode: 'white',
        date: '2025-08-31T12:00:00.000Z',
        lead: simpleRteConfig('News Detail Page Lead'),
        title: simpleRteConfig(`News detail page title ${tenant.toUpperCase()}`),
      },
      overviewPageProps: {
        teaserText: simpleRteConfig('Overview Teaser Text'),
      },
      project: project.id,
      tenant: tenantId,
    },
  });

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

};
