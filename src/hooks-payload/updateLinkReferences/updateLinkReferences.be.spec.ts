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
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getTenant } from '@/test-helpers/tenant-generator';

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
    result = await getCollectionsDocumentForId(level1.id);

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.references[0].pageId)
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
    result = await getCollectionsDocumentForId(level1.id);

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.references[0].pageId)
    .toStrictEqual(detailPage.id);

});

test('Adds/removes reference to link document (for consent fields)', {
  tag: '@linking',
}, async () => {

  const time = (new Date())
    .getTime();

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

  const result = await payload.update({
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
  const detailPageLinks = await getCollectionsDocumentForId(detailPage.id);
  const detailPage2Links = await getCollectionsDocumentForId(detailPage2.id);
  const detailPage3Links = await getCollectionsDocumentForId(detailPage3.id);

  await expect(detailPageLinks.references[0].pageId)
    .toStrictEqual(result.id);
  await expect(detailPage2Links.references[0].pageId)
    .toStrictEqual(result.id);
  await expect(detailPage3Links.references[0].pageId)
    .toStrictEqual(result.id);

  // update links in consent
  await payload.update({
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
            documentId: detailPage.id,
            slug: 'detailPage',
          }),
        },
        externalContent: {
          text: sampleRteWithLink({
            documentId: detailPage.id,
            slug: 'detailPage',
          }),
        },
        necessaryCookies: {
          text: sampleRteWithLink({
            documentId: detailPage.id,
            slug: 'detailPage',
          }),
        },
        text: sampleRteWithLink({
          documentId: detailPage.id,
          slug: 'detailPage',
        }),
      },
    },
    id: consentData.docs[0].id,
  });

  const detailPageLinksUpdated = await getCollectionsDocumentForId(detailPage.id);
  const detailPage2LinksUpdated = await getCollectionsDocumentForId(detailPage2.id);
  const detailPage3LinksUpdated = await getCollectionsDocumentForId(detailPage3.id);

  await expect(detailPageLinksUpdated.references[0].pageId)
    .toStrictEqual(result.id);
  await expect(detailPage2LinksUpdated.references)
    .toHaveLength(0);
  await expect(detailPage3LinksUpdated.references)
    .toHaveLength(0);

});

test('Adds reference to link document (for home rte)', {
  tag: '@linking',
}, async () => {
  let result: any;
  let homePageUpdated: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const home = await payload.find({
      collection: 'homePage',
    });

    const detailPage = await generateDetailPage({
      navigationTitle: 'Detail Page',
      title: `Detail Page ${time}`,
    });

    homePageUpdated = await payload.update({
      collection: 'homePage',
      data: {
        content: [
          {
            blockType: 'textBlock',
            text: sampleRteWithLink({
              documentId: detailPage.id,
              slug: 'detailPage',
            }),
          },
        ],
      },
      id: home.docs[0].id,
    });

    // get link document of detail page
    result = await getCollectionsDocumentForId(detailPage.id);

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.references[0].pageId)
    .toStrictEqual(homePageUpdated.id);

});

test('Adds reference to link document (for home homeTeasers)', {
  tag: '@linking',
}, async () => {
  let result: any;
  let homePageUpdated: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const home = await payload.find({
      collection: 'homePage',
    });

    const detailPage = await generateDetailPage({
      navigationTitle: 'Detail Page',
      title: `Detail Page ${time}`,
    });

    homePageUpdated = await payload.update({
      collection: 'homePage',
      data: {
        content: [
          {
            blockType: 'homeTeasersBlock',
            homeTeasers: [
              {
                category: 'Förderung',
                iconName: 'bar',
                link: {
                  internalLink: {
                    documentId: detailPage.id,
                    slug: 'detailPage',
                  },
                  linkText: simpleRteConfig('Zur Förderung'),
                },
                text: simpleRteConfig('Wir fördern langfristige Forschungsinfrastrukturen, unterstützen Fachgesellschaften und zeichnen Nachwuchsforschende aus. Unsere Förderpraxis sichert Stabilität, Transparenz und Wirkung - als Beitrag zu einer vielfältigen und exzellenten Forschungslandschaft.'),
                title: simpleRteConfig('Wir schaffen verlässliche Grundlagen für geistes- und sozialwissenschaftliche Forschung in der Schweiz.'),
              },

              {
                category: 'Netzwerk',
                iconName: 'bar',
                link: {
                  internalLink: {
                    documentId: detailPage.id,
                    slug: 'detailPage',
                  },
                  linkText: simpleRteConfig('Zum Netzwerkl'),
                },
                text: simpleRteConfig('Wir fördern langfristige Forschungsinfrastrukturen, unterstützen Fachgesellschaften und zeichnen Nachwuchsforschende aus. Unsere Förderpraxis sichert Stabilität, Transparenz und Wirkung - als Beitrag zu einer vielfältigen und exzellenten Forschungslandschaft.'),
                title: simpleRteConfig('Wir verbinden Disziplinen, Menschen und Institutionen in einem einzigartigen wissenschaftlichen Netzwerk.'),
              },

              {
                category: 'Aktivitäten',
                iconName: 'bar',
                link: {
                  internalLink: {
                    documentId: detailPage.id,
                    slug: 'detailPage',
                  },
                  linkText: simpleRteConfig('Zu den Aktivitäten'),
                },
                text: simpleRteConfig('Wir fördern langfristige Forschungsinfrastrukturen, unterstützen Fachgesellschaften und zeichnen Nachwuchsforschende aus. Unsere Förderpraxis sichert Stabilität, Transparenz und Wirkung - als Beitrag zu einer vielfältigen und exzellenten Forschungslandschaft.'),
                title: simpleRteConfig('Wir initiieren Debatten und vermittelt Wissen zwischen Wissenschaft, Gesellschaft und Politik.'),
              },
            ],
          },
        ],
      },
      id: home.docs[0].id,
    });

    // get link document of detail page
    result = await getCollectionsDocumentForId(detailPage.id);

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.references[0].pageId)
    .toStrictEqual(homePageUpdated.id);

});

test('Adds reference to link document (for home random teasers)', {
  tag: '@linking',
}, async () => {
  let result: any;
  let homePageUpdated: any;

  const time = (new Date())
    .getTime();

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const home = await payload.find({
      collection: 'homePage',
    });

    const detailPage = await generateDetailPage({
      navigationTitle: 'Detail Page',
      title: `Detail Page ${time}`,
    });

    homePageUpdated = await payload.update({
      collection: 'homePage',
      data: {
        content: [
          {
            blockType: 'newsTeasersBlock',
            colorMode: 'light',
            optionalLink: {
              includeLink: true,
              link: {
                internalLink: {
                  documentId: detailPage.id,
                  slug: 'detailPage',
                },
                linkText: simpleRteConfig('foo'),
              },
            },
            title: simpleRteConfig('News'),
          },
        ],
      },
      id: home.docs[0].id,
    });

    // get link document of detail page
    result = await getCollectionsDocumentForId(detailPage.id);

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.references[0].pageId)
    .toStrictEqual(homePageUpdated.id);

});

test('Adds and removes reference to header links', {
  tag: '@linking',
}, async ({
  page,
}) => {

  let headerId;
  let homeId;
  let level1;
  let detail1;
  let detail2;
  const payload = await getPayloadCached();
  const tenant = await getTenant();
  const time = (new Date())
    .getTime();

  try {

    const header = await payload.find({
      collection: 'header',
      where: {
        tenant: {
          equals: tenant,
        },
      },
    });

    headerId = header.docs[0].id;

    // empty header
    await payload.update({
      collection: 'header',
      data: {
        navigation: {},
      },
      id: headerId,
    });

    // #########################################
    // Generate pages to link to
    // #########################################

    const home = await payload.find({
      collection: 'homePage',
      where: {
        tenant: {
          equals: tenant,
        },
      },
    });

    homeId = home.docs[0].id;

    level1 = await generateOverviewPage({
      navigationTitle: 'o1',
      parentPage: {
        documentId: homeId,
        slug: 'homePage',
      },
      title: `o1 ${time}`,
    });

    detail1 = await generateDetailPage({
      navigationTitle: 'd1',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      title: `d1 ${time}`,
    });

    detail2 = await generateDetailPage({
      navigationTitle: 'd2',
      parentPage: {
        documentId: detail1.id,
        slug: 'detailPage',
      },
      title: `d2 ${time}`,
    });

    // #########################################
    // Update with italian
    // #########################################

    await payload.update({
      collection: 'overviewPage',
      data: {
        hero: {
          title: simpleRteConfig(`o1-it-${time}`),
        },
        navigationTitle: 'Overview Page it',
      },
      id: level1.id,
      locale: 'it',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        hero: {
          title: simpleRteConfig(`d1-it-${time}`),
        },
        navigationTitle: 'd1 it',
      },
      id: detail1.id,
      locale: 'it',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        hero: {
          title: simpleRteConfig(`d2-it-${time}`),
        },
        navigationTitle: 'd2 it',
      },
      id: detail2.id,
      locale: 'it',
    });

    // #########################################
    // add nav items
    // #########################################
    await payload.update({
      collection: 'header',
      data: {
        navigation: {
          navItems: [
            {
              description: simpleRteConfig('desc'),
              navItemText: simpleRteConfig('text'),
              subNavItems: [
                {
                  navItemLink: {
                    documentId: level1.id,
                    slug: 'overviewPage',
                  },
                  navItemText: simpleRteConfig('[test]nav-link1:link'),
                },
                {
                  navItemLink: {
                    documentId: detail1.id,
                    slug: 'detailPage',
                  },
                  navItemText: simpleRteConfig('[test]nav-link2:link'),
                },
                {
                  navItemLink: {
                    documentId: detail2.id,
                    slug: 'detailPage',
                  },
                  navItemText: simpleRteConfig('[test]nav-link3:link'),
                },
              ],
            },
          ],
        },
      },
      id: headerId,
    });

  } catch (e) {
    throw new Error(e instanceof Error
      ? e.message
      : String(e));
  }

  // #########################################
  // verify entries in Links collection
  // #########################################
  await page.goto('http://localhost:3000/de');
  await page.waitForLoadState('networkidle');

  const o1Link = await getCollectionsDocumentForId(level1.id);
  const d1Link = await getCollectionsDocumentForId(detail1.id);
  const d2Link = await getCollectionsDocumentForId(detail2.id);

  await expect(o1Link.references[0].pageId)
    .toStrictEqual(headerId);
  await expect(d1Link.references[0].pageId)
    .toStrictEqual(headerId);
  await expect(d2Link.references[0].pageId)
    .toStrictEqual(headerId);

  // #########################################
  // change nav items and make sure link references are removed
  // #########################################
  await payload.update({
    collection: 'header',
    data: {
      navigation: {
        navItems: [
          {
            description: simpleRteConfig('desc'),
            navItemText: simpleRteConfig('text'),
            subNavItems: [
              {
                navItemLink: {
                  documentId: level1.id,
                  slug: 'overviewPage',
                },
                navItemText: simpleRteConfig('[test]nav-link1:link'),
              },
              {
                navItemLink: {
                  documentId: level1.id,
                  slug: 'overviewPage',
                },
                navItemText: simpleRteConfig('[test]nav-link2:link'),
              },
              {
                navItemLink: {
                  documentId: level1.id,
                  slug: 'overviewPage',
                },
                navItemText: simpleRteConfig('[test]nav-link3:link'),
              },
            ],
          },
        ],
      },
    },
    id: headerId,
  });

  await page.goto('http://localhost:3000/de');
  await page.waitForLoadState('networkidle');

  const o1LinkUpdated = await getCollectionsDocumentForId(level1.id);

  const d1LinkUpdated = await getCollectionsDocumentForId(detail1.id);

  const d2LinkUpdated = await getCollectionsDocumentForId(detail2.id);

  await expect(o1LinkUpdated.references[0].pageId)
    .toStrictEqual(headerId);
  await expect(d1LinkUpdated.references)
    .toHaveLength(0);
  await expect(d2LinkUpdated.references)
    .toHaveLength(0);
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
    result = await getCollectionsDocumentForId(level1.id);

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.references)
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
    result = await getCollectionsDocumentForId(level1.id);

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.references)
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
    result = await getCollectionsDocumentForId(level1.id);

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.references)
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
    result = await getCollectionsDocumentForId(level1.id);

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.references)
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
    result = await getCollectionsDocumentForId(level1.id);

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.references[0].pageId)
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
    result = await getCollectionsDocumentForId(level1.id);

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(result.references[0].pageId)
    .toStrictEqual(level2.id);

});
