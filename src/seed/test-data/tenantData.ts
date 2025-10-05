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
      title: `${tenant.toUpperCase()} Document`,
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
      publicationTopic: `Publication Topic 1 ${tenant.toUpperCase()}`,
      tenant: tenantId,
    },
  });

  // create publication type
  const publicationType = await payload.create({
    collection: 'publicationTypes',
    data: {
      _status: 'published',
      publicationType: `Publication Type 1 ${tenant.toUpperCase()}`,
      tenant: tenantId,
    },
  });

  // create network category
  await payload.create({
    collection: 'networkCategories',
    data: {
      _status: 'published',
      name: `Network Category 1 ${tenant.toUpperCase()}`,
      tenant: tenantId,
    },
  });

  // create project
  const project = await payload.create({
    collection: 'projects',
    data: {
      _status: 'published',
      name: `Project 1 ${tenant.toUpperCase()}`,
      tenant: tenantId,
    },
  });

  // create a team
  const team = await payload.create({
    collection: 'teams',
    data: {
      _status: 'published',
      name: `Team 1 ${tenant.toUpperCase()}`,
      tenant: tenantId,
    },
  });

  // create person in people
  await payload.create({
    collection: 'people',
    data: {
      _status: 'published',
      firstname: `Firstname ${tenant.toUpperCase()}`,
      function: 'Some function',
      lastname: `Lastname ${tenant.toUpperCase()}`,
      mail: 'foo@bar.com',
      phone: '031 123 45 67',
      team: [team],
      tenant: tenantId,
    },
  });

  // create event category
  const eventCategory = await payload.create({
    collection: 'eventCategory',
    data: {
      _status: 'published',
      eventCategory: `Event Category 1 ${tenant.toUpperCase()}`,
      tenant: tenantId,
    },
  });

  // add consent data
  await payload.create({
    collection: 'consent',
    data: {
      _status: 'published',
      banner: {
        buttonAcceptAll: `Accept all ${tenant.toUpperCase()}`,
        buttonCustomizeSelection: `Customize ${tenant.toUpperCase()}`,
        buttonDeclineAll: `Decline ${tenant.toUpperCase()}`,
        text: simpleRteConfig(`Text ${tenant.toUpperCase()}`),
        title: `Title ${tenant.toUpperCase()}`,
      },
      overlay: {
        analyticsPerformance: {
          text: simpleRteConfig(`Text ${tenant.toUpperCase()}`),
          title: `Title ${tenant.toUpperCase()}`,
          toggleLabelOff: `Toggle Off ${tenant.toUpperCase()}`,
          toggleLabelOn: `Toggle On ${tenant.toUpperCase()}`,
        },
        buttonAcceptAll: `Accept all ${tenant.toUpperCase()}`,
        buttonAcceptSelection: `Accept selection ${tenant.toUpperCase()}`,
        externalContent: {
          text: simpleRteConfig(`Text ${tenant.toUpperCase()}`),
          title: `Title ${tenant.toUpperCase()}`,
          toggleLabelOff: `Toggle off ${tenant.toUpperCase()}`,
          toggleLabelOn: `Toggle on ${tenant.toUpperCase()}`,
        },
        necessaryCookies: {
          text: simpleRteConfig(`Text ${tenant.toUpperCase()}`),
          title: `Title ${tenant.toUpperCase()}`,
          toggleLabel: `Toggle label ${tenant.toUpperCase()}`,
        },
        text: simpleRteConfig(`Text ${tenant.toUpperCase()}`),
        title: `Title ${tenant.toUpperCase()}`,

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
        address1: `Address 1 ${tenant.toUpperCase()}`,
        address2: `Address 2 ${tenant.toUpperCase()}`,
        city: `City ${tenant.toUpperCase()}`,
        countryCode: `Country Code ${tenant.toUpperCase()}`,
        mail: 'foo@bar.baz',
        phone: '031 123 45 67',
        poBox: `PoBox ${tenant.toUpperCase()}`,
        title: `Title ${tenant.toUpperCase()}`,
        zipCode: `Zip ${tenant.toUpperCase()}`,
      },
      copyright: `Copyright ${tenant.toUpperCase()}`,
      impressum: `Impressum ${tenant.toUpperCase()}`,
      legal: `Legal ${tenant.toUpperCase()}`,
      tenant: tenantId,
    },
  });

  // add header data
  await payload.create({
    collection: 'header',
    data: {
      _status: 'published',
      languageNavigation: {
        description: 'Die SAGW Webseite ist in vier Sprachen verfügbar',
        title: 'Sprachen',
      },
      logo: {
        logo: 'sagw',
      },
      metanavigation: {
        metaLinks: [
          {
            linkExternal: {
              externalLink: 'https://www.foo.bar',
              externalLinkText: 'Brand Guidelines',
            },
            linkType: 'external',
          },
          {
            linkExternal: {
              externalLink: 'https://www.foo.bar',
              externalLinkText: 'Intranet',
            },
            linkType: 'external',
          },
          {
            linkExternal: {
              externalLink: 'https://www.foo.bar',
              externalLinkText: 'mySAGW',
            },
            linkType: 'external',
          },
        ],
      },
      navigation: {
        navItems: [
          {
            description: '',
            navItemLink: '/',
            navItemText: 'Home',
          },
          {
            description: 'Förderung von langfristigen Forschungsinfrastrukturen',
            navItemText: 'Förderung',
            subNavItems: [
              {
                navItemLink: '/',
                navItemText: 'Übersicht',
              },
              {
                navItemLink: '/',
                navItemText: 'Institute',
              },
              {
                navItemLink: '/',
                navItemText: 'Editionen',
              },
              {
                navItemLink: '/',
                navItemText: 'Reisebeiträge',
              },
              {
                navItemLink: '/',
                navItemText: 'Early Career Award',
              },
            ],
          },
          {
            description: 'Unsere 63 Fachgesellschaften unter einem Dach',
            navItemText: 'Netzwerk',
            subNavItems: [
              {
                navItemLink: '/',
                navItemText: 'Fachgesellschaften',
              },
            ],
          },
          {
            description: 'Vermittlung von Wissen zwischen Wissenschaft und Gesellschaft',
            navItemText: 'Aktivitäten',
            subNavItems: [
              {
                navItemLink: '/',
                navItemText: 'Übersicht',
              },
              {
                navItemLink: '/',
                navItemText: 'Magazin',
              },
              {
                navItemLink: '/',
                navItemText: 'Publikationen',
              },
              {
                navItemLink: '/',
                navItemText: 'Veranstaltungen',
              },
              {
                navItemLink: '/',
                navItemText: 'News',
              },
            ],
          },
          {
            description: 'Alles Wissenswertes über die SAGW',
            navItemText: 'Über uns',
            subNavItems: [
              {
                navItemLink: '/',
                navItemText: 'Die SAGW',
              },
              {
                navItemLink: '/',
                navItemText: 'Team',
              },
              {
                navItemLink: '/',
                navItemText: 'Kontakt',
              },
              {
                navItemLink: '/',
                navItemText: 'Offene Stellen',
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
      message: `Status Message ${tenant.toUpperCase()}`,
      show: {
        display: 'hide',
      },
      tenant: tenantId,
      title: `Status Title ${tenant.toUpperCase()}`,
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
          fieldError: 'Geben Sie Ihren Namen an.',
          fieldWidth: 'half',
          label: 'Name',
          name: 'name',
          placeholder: 'Ihr Name',
          required: true,
        },
        {
          blockType: 'emailBlock',
          fieldError: 'Geben Sie ihre E-Mail-Adresse an.',
          fieldWidth: 'half',
          label: 'E-Mail',
          name: 'email',
          placeholder: 'Ihre E-Mail Adresse',
          required: true,
        },
        {
          blockType: 'textareaBlock',
          fieldError: 'Geben Sie ihren Kommentar an.',
          fieldWidth: 'full',
          label: 'Kommentar',
          name: 'comment',
          placeholder: 'Ihr Kommentar',
          required: true,
        },
        {
          blockType: 'checkboxBlock',
          fieldError: 'Bitte akzeptieren Sie die Hinweise zum Datenschutz.',
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
        text: `Submit text error ${tenant.toUpperCase()}`,
        title: `Submit title error ${tenant.toUpperCase()}`,
      },
      submitSuccess: {
        text: `Submit text success ${tenant.toUpperCase()}`,
        title: `Submit title success ${tenant.toUpperCase()}`,
      },
      subtitle: `Subtitle for contact Form ${tenant.toUpperCase()}`,
      tenant: tenantId,
      title: `Contact Form ${tenant.toUpperCase()}`,
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
          fieldError: 'Bitte geben Sie die E-Mail Adresse an.',
          fieldWidth: 'half',
          label: 'E-Mail',
          placeholder: 'Ihre E-Mail Adresse',
        },
        name: {
          fieldError: 'Bitte geben Sie Ihren Namen an.',
          fieldWidth: 'half',
          label: 'Name',
          placeholder: 'Ihr Name',
        },
      },
      recipientMail: 'delivered@resend.dev',
      showPrivacyCheckbox: true,
      submitButtonLabel: 'Abschicken',
      submitError: {
        text: `Newsletter Submit text error ${tenant.toUpperCase()}`,
        title: `Newsletter Submit title error ${tenant.toUpperCase()}`,
      },
      submitSuccess: {
        text: `Newsletter Submit text success ${tenant.toUpperCase()}`,
        title: `Newsletter Submit title success ${tenant.toUpperCase()}`,
      },
      subtitle: `Subtitle for Newsletter Form ${tenant.toUpperCase()}`,
      tenant: tenantId,
      title: `Newsletter Form ${tenant.toUpperCase()}`,
      titleLevel: '2',
    },
  });

  // add i18n data
  await payload.create({
    collection: 'i18nGlobals',
    data: {
      _status: 'published',
      bibliographicReference: {
        copyButtonText: 'Copy button text',
        title: 'Title',
      },
      forms: {
        dataPrivacyCheckbox: {
          dataPrivacyCheckboxText: simpleRteConfig(`Data privacy checkbox ${tenant.toUpperCase()}`),
          errorMessage: 'Bitte akzeptieren sie die allgemeinen Geschäftsbedingungen',
        },
      },
      generic: {
        downloadTitle: 'Download title',
        exportArticleButtonText: 'Export article button text',
        writeEmailButtonText: 'Write email button text',
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
        lead: 'Home Lead',
        sideTitle: 'Home Side-Title',
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
      homeButtonText: 'Home Button Text',
      notFound: {
        description: 'Error description',
        title: `Not found title ${tenant.toUpperCase()}`,
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
        lead: 'Detail Page Lead',
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
        lead: 'Overview Page Lead',
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
        author: 'Author',
        colorMode: 'white',
        date: '2025-08-31T12:00:00.000Z',
        lead: 'Magazine Detail Page Lead',
        title: simpleRteConfig(`Magazine detail page title ${tenant.toUpperCase()}`),
      },
      overviewPageProps: {
        teaserText: 'Magazine Detail Teaser Text',
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
        title: `Event details title ${tenant.toUpperCase()} (render detail page)`,
      },
      hero: {
        colorMode: 'white',
        lead: 'Event Detail Page Lead',
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
        title: `Event detail title ${tenant.toUpperCase()} (render link)`,
      },
      hero: {
        colorMode: 'white',
        title: simpleRteConfig(`Event detail page title ${tenant.toUpperCase()} (render link)`),
      },
      link: {
        externalLink: 'https://www.foo.bar',
        externalLinkText: 'External Link',
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
        lead: 'News Detail Page Lead',
        title: simpleRteConfig(`News detail page title ${tenant.toUpperCase()}`),
      },
      overviewPageProps: {
        teaserText: 'Overview Teaser Text',
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
        lead: 'Publication Detail Page Lead',
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
        lead: 'Institute Detail Page Lead',
        title: simpleRteConfig(`Institute detail page title ${tenant.toUpperCase()}`),
      },
      overviewPageProps: {
        image,
        text: 'Institute Teaser Text',
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
        lead: 'National Dictionary Detail Page Lead',
        title: simpleRteConfig(`National Dictionary detail page title ${tenant.toUpperCase()}`),
      },
      overviewPageProps: {
        image,
        text: 'National Dictionary Teaser Text',
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
        lead: 'Project Detail Page Lead',
        title: simpleRteConfig(`Project detail page title ${tenant.toUpperCase()}`),
      },
      overviewPageProps: {
        text: 'Project Teaser Text',
      },
      project,
      tenant: tenantId,
    },
  });

};
