import {
  expect,
  test,
} from '@playwright/test';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import {
  generateDetailPage,
  generateOverviewPage,
} from '@/test-helpers/page-generator';
// import { generateTenant } from '@/test-helpers/tenant-generator';
import { sampleRteWithLink } from '@/utilities/rteSampleContent';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

test('Adds reference to link document (for internal links)', {
  tag: '@linking',
}, async () => {
  let result: any;
  let detailPage: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const home = await payload.find({
      collection: 'homePage',
    });

    const level1 = await generateOverviewPage({
      navigationTitle: 'Overview Page',
      parentPage: {
        documentId: home.docs[0].id,
        slug: 'homePage',
      },
      title: `Overview Page ${time}`,
    });

    const level2 = await generateDetailPage({
      title: `Other Detail Page ${time}`,
    });

    detailPage = await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'linksBlock',
            links: [
              {
                linkInternal: {
                  internalLink: {
                    documentId: level1.id,
                    slug: 'overviewPage',
                  },
                  linkText: simpleRteConfig('foo'),
                },
                linkType: 'internal',
              },
            ],
          },
        ],
      },
      id: level2.id,
    });

    // get link document of overview page
    result = await payload.find({
      collection: 'links',
      limit: 1,
      where: {
        and: [
          {
            documentId: {
              equals: level1.id,
            },
          },
        ],
      },
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.docs[0].references[0].pageId)
    .toStrictEqual(detailPage.id);

});

test('Adds reference to link document (for rte links)', {
  tag: '@linking',
}, async () => {
  let result: any;
  let detailPage: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const home = await payload.find({
      collection: 'homePage',
    });

    const level1 = await generateOverviewPage({
      navigationTitle: 'Overview Page',
      parentPage: {
        documentId: home.docs[0].id,
        slug: 'homePage',
      },
      title: `Overview Page ${time}`,
    });

    const level2 = await generateDetailPage({
      title: `Other Detail Page ${time}`,
    });

    detailPage = await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'textBlock',
            text: sampleRteWithLink({
              documentId: level1.id,
              slug: 'overviewPage',
            }),
          },
        ],
      },
      id: level2.id,
    });

    // get link document of overview page
    result = await payload.find({
      collection: 'links',
      limit: 1,
      where: {
        and: [
          {
            documentId: {
              equals: level1.id,
            },
          },
        ],
      },
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.docs[0].references[0].pageId)
    .toStrictEqual(detailPage.id);

});

test('Adds reference to link document (for consent fields)', {
  tag: '@linking',
}, async () => {
  let detailPageLinks: any;
  let detailPage2Links: any;
  let detailPage3Links: any;
  let result: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const consentData = await payload.find({
      collection: 'consent',
    });

    const detailPage = await generateDetailPage({
      navigationTitle: 'Detail Page',
      title: `Detail Page ${time}`,
    });

    const detailPage2 = await generateDetailPage({
      navigationTitle: 'Detail Page',
      title: `Detail Page 2 ${time}`,
    });

    const detailPage3 = await generateDetailPage({
      navigationTitle: 'Detail Page',
      title: `Detail Page 3 ${time}`,
    });

    result = await payload.update({
      collection: 'consent',
      data: {
        banner: {
          text: sampleRteWithLink({
            documentId: detailPage.id,
            slug: 'detailPage',
          }),
        },
        overlay: {
          analyticsPerformance: {
            text: sampleRteWithLink({
              documentId: detailPage3.id,
              slug: 'detailPage',
            }),
          },
          externalContent: {
            text: sampleRteWithLink({
              documentId: detailPage3.id,
              slug: 'detailPage',
            }),
          },
          necessaryCookies: {
            text: sampleRteWithLink({
              documentId: detailPage3.id,
              slug: 'detailPage',
            }),
          },
          text: sampleRteWithLink({
            documentId: detailPage2.id,
            slug: 'detailPage',
          }),
        },
      },
      id: consentData.docs[0].id,
    });

    // get link document of detail pages
    detailPageLinks = await payload.find({
      collection: 'links',
      limit: 1,
      where: {
        and: [
          {
            documentId: {
              equals: detailPage.id,
            },
          },
        ],
      },
    });

    detailPage2Links = await payload.find({
      collection: 'links',
      limit: 1,
      where: {
        and: [
          {
            documentId: {
              equals: detailPage2.id,
            },
          },
        ],
      },
    });

    detailPage3Links = await payload.find({
      collection: 'links',
      limit: 1,
      where: {
        and: [
          {
            documentId: {
              equals: detailPage3.id,
            },
          },
        ],
      },
    });
  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(detailPageLinks.docs[0].references[0].pageId)
    .toStrictEqual(result.id);
  await expect(detailPage2Links.docs[0].references[0].pageId)
    .toStrictEqual(result.id);
  await expect(detailPage3Links.docs[0].references[0].pageId)
    .toStrictEqual(result.id);

});

test('Adds reference to link document (for data privacy checkbox)', {
  tag: '@linking',
}, async () => {
  let result: any;
  let privacyPage: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const i18nData = await payload.find({
      collection: 'i18nGlobals',
    });

    const detailPage = await generateDetailPage({
      navigationTitle: 'Detail Page',
      title: `Detail Page ${time}`,
    });

    privacyPage = await payload.update({
      collection: 'i18nGlobals',
      data: {
        forms: {
          dataPrivacyCheckbox: {
            dataPrivacyCheckboxText: sampleRteWithLink({
              documentId: detailPage.id,
              slug: 'detailPage',
            }),
          },
        },
      },
      id: i18nData.docs[0].id,
    });

    // get link document of detail page
    result = await payload.find({
      collection: 'links',
      limit: 1,
      where: {
        and: [
          {
            documentId: {
              equals: detailPage.id,
            },
          },
        ],
      },
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.docs[0].references[0].pageId)
    .toStrictEqual(privacyPage.id);

});

test('Removes reference to the link document if links block is removed', {
  tag: '@linking',
}, async () => {
  let result: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const home = await payload.find({
      collection: 'homePage',
    });

    const level1 = await generateOverviewPage({
      navigationTitle: 'Overview Page',
      parentPage: {
        documentId: home.docs[0].id,
        slug: 'homePage',
      },
      title: `Overview Page ${time}`,
    });

    const level2 = await generateDetailPage({
      title: `Other Detail Page ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'linksBlock',
            links: [
              {
                linkInternal: {
                  internalLink: {
                    documentId: level1.id,
                    slug: 'overviewPage',
                  },
                  linkText: simpleRteConfig('foo'),
                },
                linkType: 'internal',
              },
            ],
          },
        ],
      },
      id: level2.id,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        content: [],
      },
      id: level2.id,
    });

    // get link document of overview page
    result = await payload.find({
      collection: 'links',
      limit: 1,
      where: {
        and: [
          {
            documentId: {
              equals: level1.id,
            },
          },
        ],
      },
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.docs[0].references)
    .toHaveLength(0);

});

test('Removes reference to the link document if links block is changed', {
  tag: '@linking',
}, async () => {
  let result: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const home = await payload.find({
      collection: 'homePage',
    });

    const level1 = await generateOverviewPage({
      navigationTitle: 'Overview Page',
      parentPage: {
        documentId: home.docs[0].id,
        slug: 'homePage',
      },
      title: `Overview Page ${time}`,
    });

    const level2 = await generateDetailPage({
      title: `Other Detail Page ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'linksBlock',
            links: [
              {
                linkInternal: {
                  internalLink: {
                    documentId: level1.id,
                    slug: 'overviewPage',
                  },
                  linkText: simpleRteConfig('foo'),
                },
                linkType: 'internal',
              },
            ],
          },
        ],
      },
      id: level2.id,
    });

    const level3 = await generateDetailPage({
      title: `Other Detail Page 2 ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'linksBlock',
            links: [
              {
                linkInternal: {
                  internalLink: {
                    documentId: level3.id,
                    slug: 'detailPage',
                  },
                  linkText: simpleRteConfig('foo'),
                },
                linkType: 'internal',
              },
            ],
          },
        ],
      },
      id: level2.id,
    });

    // get link document of overview page
    result = await payload.find({
      collection: 'links',
      limit: 1,
      where: {
        and: [
          {
            documentId: {
              equals: level1.id,
            },
          },
        ],
      },
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.docs[0].references)
    .toHaveLength(0);

});

test('Removes reference to the link document if rte block is removed', {
  tag: '@linking',
}, async () => {
  let result: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const home = await payload.find({
      collection: 'homePage',
    });

    const level1 = await generateOverviewPage({
      navigationTitle: 'Overview Page',
      parentPage: {
        documentId: home.docs[0].id,
        slug: 'homePage',
      },
      title: `Overview Page ${time}`,
    });

    const level2 = await generateDetailPage({
      title: `Other Detail Page ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'textBlock',
            text: sampleRteWithLink({
              documentId: level1.id,
              slug: 'overviewPage',
            }),
          },
        ],
      },
      id: level2.id,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        content: [],
      },
      id: level2.id,
    });

    // get link document of overview page
    result = await payload.find({
      collection: 'links',
      limit: 1,
      where: {
        and: [
          {
            documentId: {
              equals: level1.id,
            },
          },
        ],
      },
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.docs[0].references)
    .toHaveLength(0);

});

test('Removes reference to the link document if rte block is changed', {
  tag: '@linking',
}, async () => {
  let result: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const home = await payload.find({
      collection: 'homePage',
    });

    const level1 = await generateOverviewPage({
      navigationTitle: 'Overview Page',
      parentPage: {
        documentId: home.docs[0].id,
        slug: 'homePage',
      },
      title: `Overview Page ${time}`,
    });

    const level2 = await generateDetailPage({
      title: `Other Detail Page ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'textBlock',
            text: sampleRteWithLink({
              documentId: level1.id,
              slug: 'overviewPage',
            }),
          },
        ],
      },
      id: level2.id,
    });

    const level3 = await generateDetailPage({
      title: `Other Detail Page 2 ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'textBlock',
            text: sampleRteWithLink({
              documentId: level3.id,
              slug: 'detailPage',
            }),
          },
        ],
      },
      id: level2.id,
    });

    // get link document of overview page
    result = await payload.find({
      collection: 'links',
      limit: 1,
      where: {
        and: [
          {
            documentId: {
              equals: level1.id,
            },
          },
        ],
      },
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.docs[0].references)
    .toHaveLength(0);

});

test('Does not remove reference if link remains in rte block', {
  tag: '@linking',
}, async () => {
  let result: any;
  let level2: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const home = await payload.find({
      collection: 'homePage',
    });

    const level1 = await generateOverviewPage({
      navigationTitle: 'Overview Page',
      parentPage: {
        documentId: home.docs[0].id,
        slug: 'homePage',
      },
      title: `Overview Page ${time}`,
    });

    level2 = await generateDetailPage({
      title: `Other Detail Page 2 ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'textBlock',
            text: sampleRteWithLink({
              documentId: level1.id,
              slug: 'overviewPage',
            }),
          },
          {
            blockType: 'linksBlock',
            links: [
              {
                linkInternal: {
                  internalLink: {
                    documentId: level1.id,
                    slug: 'overviewPage',
                  },
                  linkText: simpleRteConfig('foo'),
                },
                linkType: 'internal',
              },
            ],
          },
        ],
      },
      id: level2.id,
    });

    // remove links block

    await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'textBlock',
            text: sampleRteWithLink({
              documentId: level1.id,
              slug: 'overviewPage',
            }),
          },
        ],
      },
      id: level2.id,
    });

    // get link document of overview page
    result = await payload.find({
      collection: 'links',
      limit: 1,
      where: {
        and: [
          {
            documentId: {
              equals: level1.id,
            },
          },
        ],
      },
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.docs[0].references[0].pageId)
    .toStrictEqual(level2.id);

});

test('Does not remove reference if link remains in links block', {
  tag: '@linking',
}, async () => {
  let result: any;
  let level2: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const home = await payload.find({
      collection: 'homePage',
    });

    const level1 = await generateOverviewPage({
      navigationTitle: 'Overview Page',
      parentPage: {
        documentId: home.docs[0].id,
        slug: 'homePage',
      },
      title: `Overview Page ${time}`,
    });

    level2 = await generateDetailPage({
      title: `Other Detail Page 2 ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'textBlock',
            text: sampleRteWithLink({
              documentId: level1.id,
              slug: 'overviewPage',
            }),
          },
          {
            blockType: 'linksBlock',
            links: [
              {
                linkInternal: {
                  internalLink: {
                    documentId: level1.id,
                    slug: 'overviewPage',
                  },
                  linkText: simpleRteConfig('foo'),
                },
                linkType: 'internal',
              },
            ],
          },
        ],
      },
      id: level2.id,
    });

    // remove links block

    await payload.update({
      collection: 'detailPage',
      data: {
        content: [
          {
            blockType: 'linksBlock',
            links: [
              {
                linkInternal: {
                  internalLink: {
                    documentId: level1.id,
                    slug: 'overviewPage',
                  },
                  linkText: simpleRteConfig('foo'),
                },
                linkType: 'internal',
              },
            ],
          },
        ],
      },
      id: level2.id,
    });

    // get link document of overview page
    result = await payload.find({
      collection: 'links',
      limit: 1,
      where: {
        and: [
          {
            documentId: {
              equals: level1.id,
            },
          },
        ],
      },
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.docs[0].references[0].pageId)
    .toStrictEqual(level2.id);

});
