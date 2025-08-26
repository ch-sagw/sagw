import { Payload } from 'payload';

import { seedInitialUserAndTenant } from '@/seed/init';
import {
  fetchFileByURL, simpleRteConfig,
} from '@/seed/test-data/helpers';

export const addTenant1Data = async (payload: Payload): Promise<void> => {

  // create init user & tenant
  const tenantId = await seedInitialUserAndTenant(payload);

  // fetch local images into buffer
  const sagwImageBuffer = await fetchFileByURL('http://localhost:3000/test-images/sagw.png');

  // add images to images collection
  const image = await payload.create({
    collection: 'images',
    data: {
      alt: 'SAGW image',
      department: tenantId,
    },
    file: sagwImageBuffer,
  });

  // create publication topic
  const publicationTopic = await payload.create({
    collection: 'publicationTopics',
    data: {
      department: tenantId,
      publicationTopic: 'Publication Topic 1 SAGW',
    },
  });

  // create publication type
  const publicationType = await payload.create({
    collection: 'publicationTypes',
    data: {
      department: tenantId,
      publicationType: 'Publication Type 1 SAGW',
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
      title: 'Sample Zenodo Document SAGW',
      zenodoId: '1512691',
    },
  });

  // create faq item
  await payload.create({
    collection: 'faqItems',
    data: {
      answer: simpleRteConfig('Answer 1 SAGW'),
      department: tenantId,
      question: 'Question 1 SAGW',
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
        title: simpleRteConfig('Home Title SAGW'),
      },
      meta: {
        seo: {
          description: 'SEO Description',
          image: image.id,
          index: true,
          title: 'SEO Title SAGW',
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
        title: simpleRteConfig('News 1 Title SAGW'),
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
        title: simpleRteConfig('Publication 1 Title SAGW'),
      },
      overviewPageProps: {
        image: image.id,
      },
    },
  });

};
