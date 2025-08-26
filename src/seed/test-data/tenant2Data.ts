import { Payload } from 'payload';

import {
  fetchFileByURL, simpleRteConfig,
} from '@/seed/test-data/helpers';

export const addTenant2Data = async (payload: Payload): Promise<void> => {

  // create tenant
  const tenantId = await payload.create({
    collection: 'departments',
    data: {
      name: 'NOTSAGW',
      slug: 'notsagw',
    },
  });

  // create user
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
      email: 'NOTSAGW@bar.com',
      password: process.env.PAYLOAD_INITIAL_PASSWORD,
      roles: ['global-admin'],
      username: 'init-user',
    },
  });

  // fetch local images into buffer
  const notSagwImageBuffer = await fetchFileByURL('http://localhost:3000/test-images/not-sagw.png');

  // add images to images collection
  const image = await payload.create({
    collection: 'images',
    data: {
      alt: 'NOTSAGW image',
      department: tenantId,
    },
    file: notSagwImageBuffer,
  });

  // create publication topic
  const publicationTopic = await payload.create({
    collection: 'publicationTopics',
    data: {
      department: tenantId,
      publicationTopic: 'Publication Topic 1 NOTSAGW',
    },
  });

  // create publication type
  const publicationType = await payload.create({
    collection: 'publicationTypes',
    data: {
      department: tenantId,
      publicationType: 'Publication Type 1 NOTSAGW',
    },
  });

  // add zenodo document
  await payload.create({
    collection: 'zenodoDocuments',
    data: {
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
      title: 'Sample Zenodo Document NOTSAGW',
      zenodoId: '8888',
    },
  });

  // create faq item
  await payload.create({
    collection: 'faqItems',
    data: {
      answer: simpleRteConfig('Answer 1 NOTSAGW'),
      department: tenantId,
      question: 'Question 1 NOTSAGW',
    },
  });

  // create home
  const home = await payload.create({
    collection: 'home',
    data: {
      department: tenantId,
      hero: {
        lead: 'Home Lead',
        sideTitle: 'Home Side-Title',
        title: simpleRteConfig('Home Title NOTSAGW'),
      },
      meta: {
        seo: {
          description: 'SEO Description',
          image: image.id,
          index: true,
          title: 'SEO Title NOTSAGW',
        },
      },
    },
  });

  // create news detail page
  await payload.create({
    collection: 'newsDetail',
    data: {
      department: tenantId,
      hero: {
        title: simpleRteConfig('News 1 Title NOTSAGW'),
      },
      links: [
        {
          blockType: 'linkInternal',
          internalLink: `home/${home.id}`,
          linkText: 'Link to Home',
          openInNewWindow: false,
        },
      ],
      overviewPageProps: {
        teaserText: 'Teaser Text for Overview Page',
      },
    },
  });

  // create publication detail page
  await payload.create({
    collection: 'publicationDetail',
    data: {
      categorization: {
        topic: publicationTopic.id,
        type: publicationType.id,
      },
      contentBlocks: [
        {
          text: simpleRteConfig('Publication 1 content block text'),
        },
      ],
      department: tenantId,
      hero: {
        lead: 'Publication 1 Lead',
        title: simpleRteConfig('Publication 1 Title NOTSAGW'),
      },
      overviewPageProps: {
        image: image.id,
      },
    },
  });

};
