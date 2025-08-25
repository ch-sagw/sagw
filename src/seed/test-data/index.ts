import {
  CollectionSlug, Payload,
} from 'payload';

import { collections } from '@/collections';
import { seedInitialUserAndTenant } from '@/seed/init';
import {
  fetchFileByURL, simpleRteConfig,
} from '@/seed/test-data/helpers';

export const seedTestData = async (payload: Payload): Promise<void> => {

  // security check: we need to be absolutely sure that we don't run this
  // on prod. it should be only run in playwright tests. we already have
  // a check in payload.config. double security.
  // TODO: enable check again
  // TODO: adapt github workflows to use sagwplaywright, also set
  // env var for IS_RUNNING_IN_PLAYWRIGHT_TEST_ENV
  /*
  if (
    process.env.DATABASE_NAME !== 'sagwplaywright'
    && !process.env.DATABASE_URI?.includes('sagwplaywright')) {
    console.log('will return');

    return;
  }
  */

  try {
    // delete all collections
    await Promise.all(collections.map((collection) => payload.db.deleteMany({
      collection: collection.slug as CollectionSlug,
      where: {},
    })));

    // create init user & tenant
    const tenantId = await seedInitialUserAndTenant(payload);

    // fetch local images into buffer
    const [
      sagwImageBuffer,
      notSagwImageBuffer,
    ] = await Promise.all([
      fetchFileByURL('http://localhost:3000/test-images/sagw.png'),
      fetchFileByURL('http://localhost:3000/test-images/not-sagw.png'),
    ]);

    // add images to images collection
    const [image1] = await Promise.all([
      payload.create({
        collection: 'images',
        data: {
          alt: 'SAGW image',
          department: tenantId,
        },
        file: sagwImageBuffer,
      }),
      payload.create({
        collection: 'images',
        data: {
          alt: 'Not-SAGW image',
          department: tenantId,
        },
        file: notSagwImageBuffer,
      }),
    ]);

    // create publication topic
    const publicationTopic = await payload.create({
      collection: 'publicationTopics',
      data: {
        department: tenantId,
        publicationTopic: 'Publication Topic 1',
      },
    });

    // create publication type
    const publicationType = await payload.create({
      collection: 'publicationTypes',
      data: {
        department: tenantId,
        publicationType: 'Publication Type 1',
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
        title: 'Sample Zenodo Document',
        zenodoId: '1512691',
      },
    });

    // create faq item
    /*
    const faqItem = await payload.create({
      collection: 'faqItems',
      data: {
        answer: simpleRteConfig('Answer 1'),
        department: tenantId,
        question: 'Question 1',
      },
    });
    */

    // create home
    const home = await payload.create({
      collection: 'home',
      data: {
        department: tenantId,
        hero: {
          lead: 'Home Lead',
          sideTitle: 'Home Side-Title',
          title: simpleRteConfig('Home Title'),
        },
        meta: {
          seo: {
            description: 'SEO Description',
            image: image1.id,
            index: true,
            title: 'SEO Title',
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
          title: simpleRteConfig('News 1 Title'),
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
          title: simpleRteConfig('Publication 1 Title'),
        },
        overviewPageProps: {
          image: image1.id,
        },
      },
    });

    payload.logger.info('seed test data: added faq item');

  } catch (e) {
    payload.logger.error('seed test data: error seeding test data');
    payload.logger.error(e);
  }

};
