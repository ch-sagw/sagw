import {
  expect,
  test,
} from '@playwright/test';
import {
  generateEventDetailPage,
  generateHomePage,
  generateMagazineDetailPage,
  generateNewsDetailPage,
  generateOverviewPage,
  generateProjectDetailPage,
} from '@/test-helpers/page-generator';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { generateTenant } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';

const getCollectionsDocumentForId = async (id: string): Promise<any> => {
  const payload = await getPayloadCached();

  const linksCollectionDocument = await payload.find({
    collection: 'links',
    limit: 1,
    where: {
      and: [
        {
          documentId: {
            equals: id,
          },
        },
      ],
    },
  });

  return linksCollectionDocument.docs[0];
};

// This test first adds pages (e.g. EventDetailPage, NewsDetailPage etc.)
// later on, add teaser blocks and make sure that these pages get the homeId
// as a reference in their Link-Document.
// It also tests if references are removed after pages are deleted.

test.describe('Teasers links, add pages before teasers (non-sagw)', () => {
  beforeEachAcceptCookies();
  test('added/removed correctly', {
    tag: '@linking',
  }, async () => {
    let eventPage1;
    let eventPage2;
    let newsPage1;
    let newsPage2;
    let projectPage1;
    let projectPage2;
    let magazinePage1;
    let magazinePage2;
    const time = (new Date())
      .getTime();
    const payload = await getPayloadCached();
    const tenant = await generateTenant({
      name: `tenant-${time}`,
    });
    const home = await generateHomePage({
      locale: 'de',
      sideTitle: 'Side',
      tenant: tenant.id,
      title: 'Title',
    });
    const homeId = home.id;

    try {

      // #########################################
      // Generate pages to link to
      // #########################################

      const level1a = await generateOverviewPage({
        navigationTitle: 'Overview Page',
        parentPage: {
          documentId: homeId,
          slug: 'homePage',
        },
        tenant: tenant.id,
        title: `Overview Page 1 ${time}`,
      });

      await payload.update({
        collection: 'overviewPage',
        data: {
          hero: {
            title: simpleRteConfig(`overview-page-1-it-${time}`),
          },
          navigationTitle: 'Overview Page it',
        },
        id: level1a.id,
        locale: 'it',
      });

      // #########################################
      // pages shown in teasers
      // #########################################
      eventPage1 = await generateEventDetailPage({
        date: '2029-08-03T12:00:00.000Z',
        navigationTitle: 'e1',
        parentPage: {
          documentId: level1a.id,
          slug: 'overviewPage',
        },
        tenant: tenant.id,
        title: `e1 ${time}`,
      });

      eventPage2 = await generateEventDetailPage({
        date: '2029-08-02T12:00:00.000Z',
        navigationTitle: 'e2',
        parentPage: {
          documentId: eventPage1.id,
          slug: 'eventDetailPage',
        },
        tenant: tenant.id,
        title: `e2 ${time}`,
      });

      newsPage1 = await generateNewsDetailPage({
        date: '2031-08-02T12:00:00.000Z',
        navigationTitle: 'n1',
        parentPage: {
          documentId: level1a.id,
          slug: 'overviewPage',
        },
        tenant: tenant.id,
        title: `n1 ${time}`,
      });

      newsPage2 = await generateNewsDetailPage({
        date: '2031-08-01T12:00:00.000Z',
        navigationTitle: 'n2',
        parentPage: {
          documentId: newsPage1.id,
          slug: 'newsDetailPage',
        },
        tenant: tenant.id,
        title: `n2 ${time}`,
      });

      projectPage1 = await generateProjectDetailPage({
        navigationTitle: 'p1',
        parentPage: {
          documentId: level1a.id,
          slug: 'overviewPage',
        },
        tenant: tenant.id,
        title: `p1 ${time}`,
      });

      projectPage2 = await generateProjectDetailPage({
        navigationTitle: 'p2',
        parentPage: {
          documentId: projectPage1.id,
          slug: 'projectDetailPage',
        },
        tenant: tenant.id,
        title: `p2 ${time}`,
      });

      magazinePage1 = await generateMagazineDetailPage({
        date: '2031-08-01T12:00:00.000Z',
        navigationTitle: 'm1',
        parentPage: {
          documentId: level1a.id,
          slug: 'overviewPage',
        },
        tenant: tenant.id,
        title: `m1 ${time}`,
      });

      magazinePage2 = await generateMagazineDetailPage({
        date: '2031-07-01T12:00:00.000Z',
        navigationTitle: 'm2',
        parentPage: {
          documentId: magazinePage1.id,
          slug: 'magazineDetailPage',
        },
        tenant: tenant.id,
        title: `m2 ${time}`,
      });

      // #########################################
      // Update teaser pages with italian
      // #########################################
      await payload.update({
        collection: 'eventDetailPage',
        data: {
          eventDetails: {
            title: simpleRteConfig(`e1 it ${time}`),
          },
        },
        id: eventPage1.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'eventDetailPage',
        data: {
          eventDetails: {
            title: simpleRteConfig(`e2 it ${time}`),
          },
        },
        id: eventPage2.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'newsDetailPage',
        data: {
          hero: {
            title: simpleRteConfig(`n1 it ${time}`),
          },
          overviewPageProps: newsPage1.overviewPageProps,
        },
        id: newsPage1.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'newsDetailPage',
        data: {
          hero: {
            title: simpleRteConfig(`n2 it ${time}`),
          },
          overviewPageProps: newsPage2.overviewPageProps,
        },
        id: newsPage2.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'projectDetailPage',
        data: {
          hero: {
            title: simpleRteConfig(`p1 it ${time}`),
          },
          overviewPageProps: projectPage1.overviewPageProps,
        },
        id: projectPage1.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'projectDetailPage',
        data: {
          hero: {
            title: simpleRteConfig(`p2 it ${time}`),
          },
          overviewPageProps: projectPage2.overviewPageProps,
        },
        id: projectPage2.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'magazineDetailPage',
        data: {
          hero: {
            author: magazinePage1.hero.author,
            title: simpleRteConfig(`m1 it ${time}`),
          },
          overviewPageProps: magazinePage1.overviewPageProps,
        },
        id: magazinePage1.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'magazineDetailPage',
        data: {
          hero: {
            author: magazinePage2.hero.author,
            title: simpleRteConfig(`m2 it ${time}`),
          },
          overviewPageProps: magazinePage2.overviewPageProps,
        },
        id: magazinePage2.id,
        locale: 'it',
      });

      // #########################################
      // add content to home
      // #########################################

      await payload.update({
        collection: 'homePage',
        data: {
          content: [
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
              blockType: 'magazineTeasersBlock',
              title: simpleRteConfig('News'),
            },

            // enable as soon as available
            // {
            //   blockType: 'publicationsTeasersBlock',
            //   optionalLink: {
            //     includeLink: true,
            //     link: {
            //       internalLink: {
            //         documentId: detail8.id,
            //         slug: 'detailPage',
            //       },
            //       linkText: simpleRteConfig(''),
            //     },
            //   },
            //   title: simpleRteConfig('News'),
            // },
            {
              blockType: 'projectsTeasersBlock',
              title: simpleRteConfig('News'),
            },
          ],
        },
        id: homeId,
      });

    } catch (e) {
      throw new Error(e instanceof Error
        ? e.message
        : String(e));
    }

    // #########################################
    // verify entries in Links collection for event/news/magazine/project pages
    // #########################################
    const event1Link = await getCollectionsDocumentForId(eventPage1.id);
    const event2Link = await getCollectionsDocumentForId(eventPage2.id);
    const news1Link = await getCollectionsDocumentForId(newsPage1.id);
    const news2Link = await getCollectionsDocumentForId(newsPage2.id);
    const magazine1Link = await getCollectionsDocumentForId(magazinePage1.id);
    const magazine2Link = await getCollectionsDocumentForId(magazinePage2.id);
    const project1Link = await getCollectionsDocumentForId(projectPage1.id);
    const project2Link = await getCollectionsDocumentForId(projectPage2.id);

    await expect(event1Link.references[0].pageId)
      .toStrictEqual(homeId);
    await expect(event2Link.references[0].pageId)
      .toStrictEqual(homeId);
    await expect(news1Link.references[0].pageId)
      .toStrictEqual(homeId);
    await expect(news2Link.references[0].pageId)
      .toStrictEqual(homeId);
    await expect(magazine1Link.references[0].pageId)
      .toStrictEqual(homeId);
    await expect(magazine2Link.references[0].pageId)
      .toStrictEqual(homeId);
    await expect(project1Link.references[0].pageId)
      .toStrictEqual(homeId);
    await expect(project2Link.references[0].pageId)
      .toStrictEqual(homeId);

    // empty homepage
    await payload.update({
      collection: 'homePage',
      data: {
        content: [],
      },
      id: homeId,
    });

    // #########################################
    // verify entries in Links collection are removed
    // #########################################
    const event1LinkUpdated = await getCollectionsDocumentForId(eventPage1.id);
    const event2LinkUpdated = await getCollectionsDocumentForId(eventPage2.id);
    const news1LinkUpdated = await getCollectionsDocumentForId(newsPage1.id);
    const news2LinkUpdated = await getCollectionsDocumentForId(newsPage2.id);
    const magazine1LinkUpdated = await getCollectionsDocumentForId(magazinePage1.id);
    const magazine2LinkUpdated = await getCollectionsDocumentForId(magazinePage2.id);
    const project1LinkUpdated = await getCollectionsDocumentForId(projectPage1.id);
    const project2LinkUpdated = await getCollectionsDocumentForId(projectPage2.id);

    await expect(event1LinkUpdated.references.some((ref: any) => ref.pageId === homeId))
      .toBe(false);
    await expect(event2LinkUpdated.references.some((ref: any) => ref.pageId === homeId))
      .toBe(false);
    await expect(news1LinkUpdated.references.some((ref: any) => ref.pageId === homeId))
      .toBe(false);
    await expect(news2LinkUpdated.references.some((ref: any) => ref.pageId === homeId))
      .toBe(false);
    await expect(magazine1LinkUpdated.references.some((ref: any) => ref.pageId === homeId))
      .toBe(false);
    await expect(magazine2LinkUpdated.references.some((ref: any) => ref.pageId === homeId))
      .toBe(false);
    await expect(project1LinkUpdated.references.some((ref: any) => ref.pageId === homeId))
      .toBe(false);
    await expect(project2LinkUpdated.references.some((ref: any) => ref.pageId === homeId))
      .toBe(false);
  });
});

// This test checks the reverse order: first, add teaser blocks to the page.
// later on, add pages (e.g. EventDetailPage, NewsDetailPage etc.) and make
// sure that these pages get the homeId as a reference in their Link-Document.
// It also tests if references are removed after pages are deleted.

test.describe('Teasers links, add teasers before pages (non-sagw)', () => {
  beforeEachAcceptCookies();
  test('added/removed correctly', {
    tag: '@linking',
  }, async () => {
    let eventPage1;
    let eventPage2;
    let newsPage1;
    let newsPage2;
    let projectPage1;
    let projectPage2;
    let magazinePage1;
    let magazinePage2;
    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();
    const tenant = await generateTenant({
      name: `tenant-${time}`,
    });
    const home = await generateHomePage({
      locale: 'de',
      sideTitle: 'Side',
      tenant: tenant.id,
      title: 'Title',
    });

    const homeId = home.id;

    try {
      const level1a = await generateOverviewPage({
        navigationTitle: 'Overview Page',
        parentPage: {
          documentId: homeId,
          slug: 'homePage',
        },
        tenant: tenant.id,
        title: `Overview Page 1 ${time}`,
      });

      // #########################################
      // add content to home
      // #########################################

      await payload.update({
        collection: 'homePage',
        data: {
          content: [
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
              blockType: 'magazineTeasersBlock',
              title: simpleRteConfig('News'),
            },

            // enable as soon as available
            // {
            //   blockType: 'publicationsTeasersBlock',
            //   optionalLink: {
            //     includeLink: true,
            //     link: {
            //       internalLink: {
            //         documentId: detail8.id,
            //         slug: 'detailPage',
            //       },
            //       linkText: simpleRteConfig(''),
            //     },
            //   },
            //   title: simpleRteConfig('News'),
            // },
            {
              blockType: 'projectsTeasersBlock',
              title: simpleRteConfig('News'),
            },
          ],
        },
        id: homeId,
      });

      // #########################################
      // pages shown in teasers
      // #########################################
      eventPage1 = await generateEventDetailPage({
        date: '2029-08-03T12:00:00.000Z',
        navigationTitle: 'e1',
        parentPage: {
          documentId: level1a.id,
          slug: 'overviewPage',
        },
        tenant: tenant.id,
        title: `e1 ${time}`,
      });

      eventPage2 = await generateEventDetailPage({
        date: '2029-08-02T12:00:00.000Z',
        navigationTitle: 'e2',
        parentPage: {
          documentId: eventPage1.id,
          slug: 'eventDetailPage',
        },
        tenant: tenant.id,
        title: `e2 ${time}`,
      });

      newsPage1 = await generateNewsDetailPage({
        date: '2031-08-02T12:00:00.000Z',
        navigationTitle: 'n1',
        parentPage: {
          documentId: level1a.id,
          slug: 'overviewPage',
        },
        tenant: tenant.id,
        title: `n1 ${time}`,
      });

      newsPage2 = await generateNewsDetailPage({
        date: '2031-08-01T12:00:00.000Z',
        navigationTitle: 'n2',
        parentPage: {
          documentId: newsPage1.id,
          slug: 'newsDetailPage',
        },
        tenant: tenant.id,
        title: `n2 ${time}`,
      });

      projectPage1 = await generateProjectDetailPage({
        navigationTitle: 'p1',
        parentPage: {
          documentId: level1a.id,
          slug: 'overviewPage',
        },
        tenant: tenant.id,
        title: `p1 ${time}`,
      });

      projectPage2 = await generateProjectDetailPage({
        navigationTitle: 'p2',
        parentPage: {
          documentId: projectPage1.id,
          slug: 'projectDetailPage',
        },
        tenant: tenant.id,
        title: `p2 ${time}`,
      });

      magazinePage1 = await generateMagazineDetailPage({
        date: '2031-08-01T12:00:00.000Z',
        navigationTitle: 'm1',
        parentPage: {
          documentId: level1a.id,
          slug: 'overviewPage',
        },
        tenant: tenant.id,
        title: `m1 ${time}`,
      });

      magazinePage2 = await generateMagazineDetailPage({
        date: '2031-07-01T12:00:00.000Z',
        navigationTitle: 'm2',
        parentPage: {
          documentId: magazinePage1.id,
          slug: 'magazineDetailPage',
        },
        tenant: tenant.id,
        title: `m2 ${time}`,
      });

    } catch (e) {
      throw new Error(e instanceof Error
        ? e.message
        : String(e));
    }

    // #########################################
    // verify entries in Links collection for event/news/magazine/project pages
    // #########################################
    const event1Link = await getCollectionsDocumentForId(eventPage1.id);
    const event2Link = await getCollectionsDocumentForId(eventPage2.id);
    const news1Link = await getCollectionsDocumentForId(newsPage1.id);
    const news2Link = await getCollectionsDocumentForId(newsPage2.id);
    const magazine1Link = await getCollectionsDocumentForId(magazinePage1.id);
    const magazine2Link = await getCollectionsDocumentForId(magazinePage2.id);
    const project1Link = await getCollectionsDocumentForId(projectPage1.id);
    const project2Link = await getCollectionsDocumentForId(projectPage2.id);

    await expect(event1Link.references.some((ref: any) => ref.pageId === homeId))
      .toBe(true);
    await expect(event2Link.references.some((ref: any) => ref.pageId === homeId))
      .toBe(true);
    await expect(news1Link.references.some((ref: any) => ref.pageId === homeId))
      .toBe(true);
    await expect(news2Link.references.some((ref: any) => ref.pageId === homeId))
      .toBe(true);
    await expect(magazine1Link.references.some((ref: any) => ref.pageId === homeId))
      .toBe(true);
    await expect(magazine2Link.references.some((ref: any) => ref.pageId === homeId))
      .toBe(true);
    await expect(project1Link.references.some((ref: any) => ref.pageId === homeId))
      .toBe(true);
    await expect(project2Link.references.some((ref: any) => ref.pageId === homeId))
      .toBe(true);

    // empty homepage
    await payload.update({
      collection: 'homePage',
      data: {
        content: [],
      },
      id: homeId,
    });

    // #########################################
    // verify entries in Links collection are removed
    // #########################################
    const event1LinkUpdated = await getCollectionsDocumentForId(eventPage1.id);
    const event2LinkUpdated = await getCollectionsDocumentForId(eventPage2.id);
    const news1LinkUpdated = await getCollectionsDocumentForId(newsPage1.id);
    const news2LinkUpdated = await getCollectionsDocumentForId(newsPage2.id);
    const magazine1LinkUpdated = await getCollectionsDocumentForId(magazinePage1.id);
    const magazine2LinkUpdated = await getCollectionsDocumentForId(magazinePage2.id);
    const project1LinkUpdated = await getCollectionsDocumentForId(projectPage1.id);
    const project2LinkUpdated = await getCollectionsDocumentForId(projectPage2.id);

    await expect(event1LinkUpdated.references.some((ref: any) => ref.pageId === homeId))
      .toBe(false);
    await expect(event2LinkUpdated.references.some((ref: any) => ref.pageId === homeId))
      .toBe(false);
    await expect(news1LinkUpdated.references.some((ref: any) => ref.pageId === homeId))
      .toBe(false);
    await expect(news2LinkUpdated.references.some((ref: any) => ref.pageId === homeId))
      .toBe(false);
    await expect(magazine1LinkUpdated.references.some((ref: any) => ref.pageId === homeId))
      .toBe(false);
    await expect(magazine2LinkUpdated.references.some((ref: any) => ref.pageId === homeId))
      .toBe(false);
    await expect(project1LinkUpdated.references.some((ref: any) => ref.pageId === homeId))
      .toBe(false);
    await expect(project2LinkUpdated.references.some((ref: any) => ref.pageId === homeId))
      .toBe(false);
  });
});
