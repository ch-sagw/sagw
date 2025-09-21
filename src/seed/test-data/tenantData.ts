/* eslint-disable @typescript-eslint/naming-convention */

import { Payload } from 'payload';

import { simpleRteConfig } from '@/seed/test-data/helpers';

export const addDataForTenant = async (payload: Payload, tenant: string): Promise<void> => {

  // ############
  // Tenant & User
  // ############

  // create tenant
  const tenantId = await payload.create({
    collection: 'departments',
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
        department: tenantId,
        departments: [
          {
            department: tenantId,
            roles: ['admin'],
          },
        ],
        email: tenant === 'sagw'
          ? process.env.PAYLOAD_INITIAL_USER_MAIL
          : `${tenant}@foo.bar`,
        password: process.env.PAYLOAD_INITIAL_PASSWORD,
        roles: ['global-user'],
        username: tenant,
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
      department: tenantId,
    },
    filePath: `src/seed/test-data/assets/${tenant}.png`,
  });

  // add svg
  const svg = await payload.create({
    collection: 'svgs',
    data: {
      _status: 'published',
      department: tenantId,
      name: `${tenant.toUpperCase()} SVG`,
    },
    filePath: `src/seed/test-data/assets/${tenant}.svg`,
  });

  // add video
  await payload.create({
    collection: 'videos',
    data: {
      _status: 'published',
      department: tenantId,
    },
    filePath: `src/seed/test-data/assets/${tenant}.mp4`,
  });

  // add document
  await payload.create({
    collection: 'documents',
    data: {
      _status: 'published',
      department: tenantId,
      title: `${tenant.toUpperCase()} Document`,
    },
    filePath: `src/seed/test-data/assets/${tenant}.pdf`,
  });

  // add zenodo document
  await payload.create({
    collection: 'zenodoDocuments',
    data: {
      _status: 'published',
      department: tenantId,
      files: [
        {
          format: 'pdf',
          id: 'someid',
          link: 'https://foo.bar',
          size: 0.26,
        },
      ],
      publicationDate: '1919-05-01',
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
        department: tenantId,
        files: [
          {
            format: 'pdf',
            id: 'someid',
            link: 'https://foo.bar',
            size: 0.26,
          },
        ],
        publicationDate: '1919-05-01',
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
      department: tenantId,
      publicationTopic: `Publication Topic 1 ${tenant.toUpperCase()}`,
    },
  });

  // create publication type
  const publicationType = await payload.create({
    collection: 'publicationTypes',
    data: {
      _status: 'published',
      department: tenantId,
      publicationType: `Publication Type 1 ${tenant.toUpperCase()}`,
    },
  });

  // create network category
  await payload.create({
    collection: 'networkCategories',
    data: {
      _status: 'published',
      department: tenantId,
      name: `Network Category 1 ${tenant.toUpperCase()}`,
    },
  });

  // create project
  const project = await payload.create({
    collection: 'projects',
    data: {
      _status: 'published',
      department: tenantId,
      name: `Project 1 ${tenant.toUpperCase()}`,
    },
  });

  // create person in people
  await payload.create({
    collection: 'people',
    data: {
      _status: 'published',
      department: tenantId,
      firstname: `Firstname ${tenant.toUpperCase()}`,
      function: 'Some function',
      lastname: `Lastname ${tenant.toUpperCase()}`,
      mail: 'foo@bar.com',
      memberType: 'executiveBoard',
      personDepartment: 'admin',
      phone: '031 123 45 67',
    },
  });

  // create event category
  const eventCategory = await payload.create({
    collection: 'eventCategory',
    data: {
      _status: 'published',
      department: tenantId,
      eventCategory: `Event Category 1 ${tenant.toUpperCase()}`,
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
        text: {
          content: simpleRteConfig(`Text ${tenant.toUpperCase()}`),
        },
        title: `Title ${tenant.toUpperCase()}`,
      },
      department: tenantId,
      overlay: {
        analyticsPerformance: {
          text: {
            content: simpleRteConfig(`Text ${tenant.toUpperCase()}`),
          },
          title: `Title ${tenant.toUpperCase()}`,
          toggleLabelOff: `Toggle Off ${tenant.toUpperCase()}`,
          toggleLabelOn: `Toggle On ${tenant.toUpperCase()}`,
        },
        buttonAcceptAll: `Accept all ${tenant.toUpperCase()}`,
        buttonAcceptSelection: `Accept selection ${tenant.toUpperCase()}`,
        externalContent: {
          text: {
            content: simpleRteConfig(`Text ${tenant.toUpperCase()}`),
          },
          title: `Title ${tenant.toUpperCase()}`,
          toggleLabelOff: `Toggle off ${tenant.toUpperCase()}`,
          toggleLabelOn: `Toggle on ${tenant.toUpperCase()}`,
        },
        necessaryCookies: {
          text: {
            content: simpleRteConfig(`Text ${tenant.toUpperCase()}`),
          },
          title: `Title ${tenant.toUpperCase()}`,
          toggleLabel: `Toggle label ${tenant.toUpperCase()}`,
        },
        text: {
          content: simpleRteConfig(`Text ${tenant.toUpperCase()}`),
        },
        title: `Title ${tenant.toUpperCase()}`,

      },
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
      department: tenantId,
      impressum: `Impressum ${tenant.toUpperCase()}`,
      legal: `Legal ${tenant.toUpperCase()}`,
    },
  });

  // add header data
  await payload.create({
    collection: 'header',
    data: {
      _status: 'published',
      department: tenantId,
      logo: svg,
      metaLinks: [
        {
          linkExternal: {
            externalLink: 'https://www.foo.bar',
            externalLinkText: `Metalink ${tenant.toUpperCase()}`,
          },
          linkType: 'external',
        },
      ],
      navigation: {
        navItems: [
          {
            navItemText: 'Home',
          },
        ],
      },
    },
  });

  // add status message
  await payload.create({
    collection: 'statusMessage',
    data: {
      _status: 'published',
      department: tenantId,
      message: `Status Message ${tenant.toUpperCase()}`,
      show: {
        display: 'hide',
      },
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
      department: tenantId,
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
          label: {
            content: simpleRteConfig('Ich habe die Hinweise zum Datenschutz gelesen und akzeptiere sie.'),
          },
          name: 'checkbox',
          required: true,
        },
      ],
      isNewsletterForm: 'custom',
      mailSubject: 'Form submission on SAGW',
      recipientMail: 'delivered@resend.dev',
      showPrivacyCheckbox: false,
      submitButtonLabel: 'Abschicken',
      subtitle: `Subtitle for contact Form ${tenant.toUpperCase()}`,
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
      department: tenantId,
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
      subtitle: `Subtitle for Newsletter Form ${tenant.toUpperCase()}`,
      title: `Newsletter Form ${tenant.toUpperCase()}`,
      titleLevel: '2',
    },
  });

  // add i18n for forms
  await payload.create({
    collection: 'i18nForms',
    data: {
      _status: 'published',
      department: tenantId,
      i18nForms: {
        dataPrivacyCheckbox: {
          dataPrivacyCheckboxText: {
            content: simpleRteConfig(`Data privacy checkbox ${tenant.toUpperCase()}`),
          },
          errorMessage: 'Bitte akzeptieren sie die allgemeinen Geschäftsbedingungen',
        },
        newsletterSubmitSuccess: {
          text: `Newsletter Submit text success ${tenant.toUpperCase()}`,
          title: `Newsletter Submit title success ${tenant.toUpperCase()}`,
        },
        submitError: {
          text: `Submit text error ${tenant.toUpperCase()}`,
          title: `Submit title error ${tenant.toUpperCase()}`,
        },
        submitSuccess: {
          text: `Submit text success ${tenant.toUpperCase()}`,
          title: `Submit title success ${tenant.toUpperCase()}`,
        },
      },
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
          text: {
            content: simpleRteConfig('Sample notification text.'),
          },
        },
        {
          blockType: 'textBlock',
          text: {
            content: simpleRteConfig('Sample Rte Block Content 1.'),
          },
        },
        {
          blockType: 'textBlock',
          text: {
            content: simpleRteConfig('Sample Rte Block Content 2.'),
          },
        },
      ],
      department: tenantId,
      hero: {
        animated: true,
        lead: 'Home Lead',
        sideTitle: 'Home Side-Title',
        title: {
          content: simpleRteConfig(`Home Title ${tenant.toUpperCase()}`),
        },
      },
      meta: {
        seo: {
          description: `SEO Description ${tenant.toUpperCase()}`,
          image: image.id,
          index: true,
          title: `SEO Title ${tenant.toUpperCase()}`,
        },
      },
    },
  });

  // create error page
  await payload.create({
    collection: 'errorPage',
    data: {
      _status: 'published',
      department: tenantId,
      homeButtonText: 'Home Button Text',
      notFound: {
        description: 'Error description',
        title: `Not found title ${tenant.toUpperCase()}`,
      },
    },
  });

  // create detail page
  await payload.create({
    collection: 'detailPage',
    data: {
      _status: 'published',
      department: tenantId,
      hero: {
        colorMode: 'color',
        colorScheme: 'bright',
        lead: 'Detail Page Lead',
        title: {
          content: simpleRteConfig(`Detail page title ${tenant.toUpperCase()}`),
        },
      },
    },
  });

  // create overview page
  await payload.create({
    collection: 'overviewPage',
    data: {
      _status: 'published',
      department: tenantId,
      hero: {
        colorMode: 'color',
        colorScheme: 'bright',
        lead: 'Overview Page Lead',
        title: {
          content: simpleRteConfig(`Overview page title ${tenant.toUpperCase()}`),
        },
      },
    },
  });

  // create magazine detail page
  await payload.create({
    collection: 'magazineDetailPage',
    data: {
      _status: 'published',
      department: tenantId,
      hero: {
        author: 'Author',
        colorMode: 'color',
        colorScheme: 'bright',
        date: '2025-08-31T12:00:00.000Z',
        lead: 'Magazine Detail Page Lead',
        title: {
          content: simpleRteConfig(`Magazine detail page title ${tenant.toUpperCase()}`),
        },
      },
      overviewPageProps: {
        teaserText: 'Magazine Detail Teaser Text',
      },
    },
  });

  // event detail page (render detail Page)
  await payload.create({
    collection: 'eventDetailPage',
    data: {
      _status: 'published',
      department: tenantId,
      eventDetails: {
        category: eventCategory.id,
        date: '2025-08-31T12:00:00.000Z',
        project: project.id,
        title: `Event details title ${tenant.toUpperCase()} (render detail page)`,
      },
      hero: {
        colorMode: 'color',
        colorScheme: 'bright',
        lead: 'Event Detail Page Lead',
        title: {
          content: simpleRteConfig(`Event detail page title ${tenant.toUpperCase()} (render detail page)`),
        },
      },
      showDetailPage: 'true',
    },
  });

  // event detail page (render detail Page)
  await payload.create({
    collection: 'eventDetailPage',
    data: {
      _status: 'published',
      department: tenantId,
      eventDetails: {
        category: eventCategory.id,
        date: '2025-08-31T12:00:00.000Z',
        project: project.id,
        title: `Event detail title ${tenant.toUpperCase()} (render link)`,
      },
      hero: {
        colorMode: 'color',
        colorScheme: 'bright',
        title: {
          content: simpleRteConfig(`Event detail page title ${tenant.toUpperCase()} (render link)`),
        },
      },
      link: {
        externalLink: 'https://www.foo.bar',
        externalLinkText: 'External Link',
      },
      showDetailPage: 'false',
    },
  });

  // news detail page
  await payload.create({
    collection: 'newsDetailPage',
    data: {
      _status: 'published',
      department: tenantId,
      hero: {
        colorMode: 'color',
        colorScheme: 'bright',
        date: '2025-08-31T12:00:00.000Z',
        lead: 'News Detail Page Lead',
        title: {
          content: simpleRteConfig(`News detail page title ${tenant.toUpperCase()}`),
        },
      },
      overviewPageProps: {
        teaserText: 'Overview Teaser Text',
      },
      project: project.id,
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
      department: tenantId,
      hero: {
        colorMode: 'color',
        colorScheme: 'bright',
        lead: 'Publication Detail Page Lead',
        title: {
          content: simpleRteConfig(`Publication detail page title ${tenant.toUpperCase()}`),
        },
      },
      overviewPageProps: {
        image,
      },
    },
  });

  // institute detail page
  await payload.create({
    collection: 'instituteDetailPage',
    data: {
      _status: 'published',
      department: tenantId,
      hero: {
        colorMode: 'color',
        colorScheme: 'bright',
        lead: 'Institute Detail Page Lead',
        title: {
          content: simpleRteConfig(`Institute detail page title ${tenant.toUpperCase()}`),
        },
      },
      overviewPageProps: {
        image,
        text: 'Institute Teaser Text',
      },
    },
  });

  // national dictionary detail page
  await payload.create({
    collection: 'nationalDictionaryDetailPage',
    data: {
      _status: 'published',
      department: tenantId,
      hero: {
        colorMode: 'color',
        colorScheme: 'bright',
        lead: 'National Dictionary Detail Page Lead',
        title: {
          content: simpleRteConfig(`National Dictionary detail page title ${tenant.toUpperCase()}`),
        },
      },
      overviewPageProps: {
        image,
        text: 'National Dictionary Teaser Text',
      },
    },
  });

  // project detail page
  await payload.create({
    collection: 'projectDetailPage',
    data: {
      _status: 'published',
      department: tenantId,
      hero: {
        colorMode: 'color',
        colorScheme: 'bright',
        lead: 'Project Detail Page Lead',
        title: {
          content: simpleRteConfig(`Project detail page title ${tenant.toUpperCase()}`),
        },
      },
      overviewPageProps: {
        text: 'Project Teaser Text',
      },
      project,
    },
  });

};
