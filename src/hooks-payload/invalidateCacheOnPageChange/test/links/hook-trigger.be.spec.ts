// this test makes sure that the hook is triggered on every page that acts
// as a link target.
// In the end, every page type as source is tested in all combinations
// with every page type as target.

import {
  expect,
  test,
} from '@playwright/test';
import {
  generateAllPageTypes,
  generateOverviewPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import {
  getTenantId, getTenantOfId,
} from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { sampleRteWithLink } from '@/utilities/rteSampleContent';
import { LogCapture } from '@/test-helpers/capture-logs';
import { CollectionSlug } from 'payload';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';

/* eslint-disable no-await-in-loop */

test.describe('Hook triggers on all page types (sagw)', () => {

  test('if slug of target changes', {
    tag: '@cache',
  }, async () => {
    await deleteSetsPages();

    const logCapture = new LogCapture();
    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();
    const tenant = await getTenantId({
      isSagw: true,
      time,
    });
    const home = await getHomeId({
      isSagw: true,
      tenant,
    });

    const generatedPagesTarget = await generateAllPageTypes({
      home,
      iterator: 1,
      tenant,
      time,
    });

    // 1. loop: iterate over all pages, these act as link targets
    // 2. loop: iterate over all pages, these link to the target (source)
    for (const [
      indexLinkTarget,
      collectionSlugLinkTarget,
    ] of Object.keys(generatedPagesTarget)
        .entries()) {

      const generatedPagesSource = await generateAllPageTypes({
        home,
        iterator: indexLinkTarget + 2,
        tenant,
        time,
      });

      for (const [
        indexLinkSource,
        collectionSlugLinkSource,
      ] of Object.keys(generatedPagesSource)
          .entries()) {

        const targetPage = generatedPagesTarget[collectionSlugLinkTarget as keyof typeof generatedPagesTarget];
        const sourcePage = generatedPagesSource[collectionSlugLinkSource as keyof typeof generatedPagesSource];

        // prepare content for source page
        let contentBlocksData: any = {
          content: [
            {
              blockType: 'textBlock',
              text: sampleRteWithLink({
                documentId: targetPage.id,
                slug: collectionSlugLinkTarget,
                text: '[test]rte:link',
              }),
            },
          ],
        };

        let emptyContentBlocksData: any = {
          content: [],
        };

        if (collectionSlugLinkSource === 'eventDetailPage') {
          contentBlocksData = {
            blocks: {
              content: [
                {
                  blockType: 'textBlock',
                  text: sampleRteWithLink({
                    documentId: targetPage.id,
                    slug: collectionSlugLinkTarget,
                    text: '[test]rte:link',
                  }),
                },
              ],
            },
          };

          emptyContentBlocksData = {
            blocks: {
              content: [],
            },
          };
        }

        // add content to source page
        await payload.update({
          collection: collectionSlugLinkSource as CollectionSlug,
          data: contentBlocksData,
          id: sourcePage.id,
        });

        logCapture.captureLogs();

        // update target page
        await payload.update({
          collection: collectionSlugLinkTarget as CollectionSlug,
          data: {
            slug: `${collectionSlugLinkTarget}-linked-${time}-${indexLinkTarget + 1}-${indexLinkSource + 1}`,
          },
          id: targetPage.id,
        });

        logCapture.detachLogs();

        // expect invalidation for source page

        const parentPageOfSourcePage = await payload.findByID({
          collection: sourcePage.parentPage?.slug as CollectionSlug,
          id: sourcePage.parentPage?.documentId || '',
          locale: 'all',
        }) as any;

        const expectedUrl = parentPageOfSourcePage.slug.de === 'home'
          ? `${sourcePage.slug}`
          : `${parentPageOfSourcePage.slug.de}/${sourcePage.slug}`;

        expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${expectedUrl}`))
          .toBe(true);

        expect(logCapture.logs)
          .toHaveLength(2);

        // remove content from source page
        await payload.update({
          collection: collectionSlugLinkSource as CollectionSlug,
          data: emptyContentBlocksData,
          id: sourcePage.id,
        });

      }
    }
  });

  test('if slug of target changes in another locale', {
    tag: '@cache',
  }, async () => {
    await deleteSetsPages();
    const logCapture = new LogCapture();
    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();
    const tenant = await getTenantId({
      isSagw: true,
      time,
    });
    const home = await getHomeId({
      isSagw: true,
      tenant,
    });

    const generatedPagesTarget = await generateAllPageTypes({
      home,
      iterator: 1,
      tenant,
      time,
    });

    // 1. loop: iterate over all pages, these act as link targets
    // 2. loop: iterate over all pages, these link to the target (source)
    for (const [
      indexLinkTarget,
      collectionSlugLinkTarget,
    ] of Object.keys(generatedPagesTarget)
        .entries()) {

      const generatedPagesSource = await generateAllPageTypes({
        home,
        iterator: indexLinkTarget + 2,
        tenant,
        time,
      });

      for (const [
        indexLinkSource,
        collectionSlugLinkSource,
      ] of Object.keys(generatedPagesSource)
          .entries()) {

        const targetPage = generatedPagesTarget[collectionSlugLinkTarget as keyof typeof generatedPagesTarget];
        const sourcePage = generatedPagesSource[collectionSlugLinkSource as keyof typeof generatedPagesSource];

        // prepare content for source page
        let contentBlocksData: any = {
          content: [
            {
              blockType: 'textBlock',
              text: sampleRteWithLink({
                documentId: targetPage.id,
                slug: collectionSlugLinkTarget,
                text: '[test]rte:link',
              }),
            },
          ],
        };

        let emptyContentBlocksData: any = {
          content: [],
        };

        if (collectionSlugLinkSource === 'eventDetailPage') {
          contentBlocksData = {
            blocks: {
              content: [
                {
                  blockType: 'textBlock',
                  text: sampleRteWithLink({
                    documentId: targetPage.id,
                    slug: collectionSlugLinkTarget,
                    text: '[test]rte:link',
                  }),
                },
              ],
            },
          };

          emptyContentBlocksData = {
            blocks: {
              content: [],
            },
          };
        }

        // add content to source page
        await payload.update({
          collection: collectionSlugLinkSource as CollectionSlug,
          data: contentBlocksData,
          id: sourcePage.id,
        });

        logCapture.captureLogs();

        // update target page
        await payload.update({
          collection: collectionSlugLinkTarget as CollectionSlug,
          data: {
            slug: `${collectionSlugLinkTarget}-linked-${time}-${indexLinkTarget + 1}-${indexLinkSource + 1}`,
          },
          id: targetPage.id,
          locale: 'it',
        });

        logCapture.detachLogs();

        // expect invalidation for source page

        const parentPageOfSourcePage = await payload.findByID({
          collection: sourcePage.parentPage?.slug as CollectionSlug,
          id: sourcePage.parentPage?.documentId || '',
          locale: 'all',
        }) as any;

        const expectedUrl = parentPageOfSourcePage.slug.de === 'home'
          ? `${sourcePage.slug}`
          : `${parentPageOfSourcePage.slug.it}/${sourcePage.slug}`;

        expect(logCapture.hasLog(`[CACHE] invalidating path: /it/${expectedUrl}`))
          .toBe(true);

        expect(logCapture.logs)
          .toHaveLength(2);

        // remove content from source page
        await payload.update({
          collection: collectionSlugLinkSource as CollectionSlug,
          data: emptyContentBlocksData,
          id: sourcePage.id,
        });

      }
    }
  });

  test('if parent page of target changes', {
    tag: '@cache',
  }, async () => {
    await deleteSetsPages();
    const logCapture = new LogCapture();
    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();
    const tenant = await getTenantId({
      isSagw: true,
      time,
    });
    const home = await getHomeId({
      isSagw: true,
      tenant,
    });

    const generatedPagesTarget = await generateAllPageTypes({
      home,
      iterator: 1,
      tenant,
      time,
    });

    // 1. loop: iterate over all pages, these act as link targets
    // 2. loop: iterate over all pages, these link to the target (source)
    for (const [
      indexLinkTarget,
      collectionSlugLinkTarget,
    ] of Object.keys(generatedPagesTarget)
        .entries()) {
      const generatedPagesSource = await generateAllPageTypes({
        home,
        iterator: indexLinkTarget + 2,
        tenant,
        time,
      });

      for (const [
        indexLinkSource,
        collectionSlugLinkSource,
      ] of Object.keys(generatedPagesSource)
          .entries()) {

        const targetPage = generatedPagesTarget[collectionSlugLinkTarget as keyof typeof generatedPagesTarget];
        const sourcePage = generatedPagesSource[collectionSlugLinkSource as keyof typeof generatedPagesSource];
        const oldParentPage = targetPage.parentPage;
        const newParentPage = await generateOverviewPage({
          navigationTitle: `parent page ${time} ${indexLinkTarget + 1} ${indexLinkSource + 1}`,
          parentPage: {
            documentId: home,
            slug: 'homePage',
          },
          title: `parent page ${time} ${indexLinkTarget + 1} ${indexLinkSource + 1}`,
        });

        await payload.update({
          collection: 'overviewPage',
          data: {
            hero: {
              title: simpleRteConfig(`parent page ${time} ${indexLinkTarget + 1} ${indexLinkSource + 1} it`),
            },
            navigationTitle: `parent page ${time} ${indexLinkTarget + 1} ${indexLinkSource + 1} it`,
          },
          id: newParentPage.id,
          locale: 'it',
        });

        // prepare content for source page
        let contentBlocksData: any = {
          content: [
            {
              blockType: 'textBlock',
              text: sampleRteWithLink({
                documentId: targetPage.id,
                slug: collectionSlugLinkTarget,
                text: '[test]rte:link',
              }),
            },
          ],
        };

        let emptyContentBlocksData: any = {
          content: [],
        };

        if (collectionSlugLinkSource === 'eventDetailPage') {
          contentBlocksData = {
            blocks: {
              content: [
                {
                  blockType: 'textBlock',
                  text: sampleRteWithLink({
                    documentId: targetPage.id,
                    slug: collectionSlugLinkTarget,
                    text: '[test]rte:link',
                  }),
                },
              ],
            },
          };

          emptyContentBlocksData = {
            blocks: {
              content: [],
            },
          };
        }

        // add content to source page
        await payload.update({
          collection: collectionSlugLinkSource as CollectionSlug,
          data: contentBlocksData,
          id: sourcePage.id,
        });

        // overview can not have overview as parent. it can only have home
        // as parent, thus we can not change the parnet of overview in this,
        // test, thus we skip it.
        if (collectionSlugLinkTarget === 'overviewPage') {
          break;
        }

        logCapture.captureLogs();

        // update target page
        await payload.update({
          collection: collectionSlugLinkTarget as CollectionSlug,
          data: {
            parentPage: {
              documentId: newParentPage.id,
              slug: 'overviewPage',
            },
          },
          id: targetPage.id,
        });

        logCapture.detachLogs();

        // expect invalidation for source page
        const parentPageOfSourcePage = await payload.findByID({
          collection: sourcePage.parentPage?.slug as CollectionSlug,
          id: sourcePage.parentPage?.documentId || '',
          locale: 'all',
        }) as any;

        const expectedInvalidationPathForPageDe = parentPageOfSourcePage.slug.de === 'home'
          ? `${sourcePage.slug}`
          : `${parentPageOfSourcePage.slug.de}/${sourcePage.slug}`;

        const expectedInvalidationPathForPageIt = parentPageOfSourcePage.slug.de === 'home'
          ? `${sourcePage.slug}`
          : `${parentPageOfSourcePage.slug.it}/${sourcePage.slug}`;

        expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${expectedInvalidationPathForPageDe}`))
          .toBe(true);
        expect(logCapture.hasLog(`[CACHE] invalidating path: /it/${expectedInvalidationPathForPageIt}`))
          .toBe(true);
        expect(logCapture.logs)
          .toHaveLength(2);

        // reset parent page on target
        await payload.update({
          collection: collectionSlugLinkTarget as CollectionSlug,
          data: {
            parentPage: oldParentPage,
          },
          id: targetPage.id,
        });

        // remove content from source page
        await payload.update({
          collection: collectionSlugLinkSource as CollectionSlug,
          data: emptyContentBlocksData,
          id: sourcePage.id,
        });

      }
    }
  });

  test('if parent page of target changes slug', {
    tag: '@cache',
  }, async () => {
    await deleteSetsPages();
    const logCapture = new LogCapture();
    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();
    const tenant = await getTenantId({
      isSagw: true,
      time,
    });
    const home = await getHomeId({
      isSagw: true,
      tenant,
    });

    const generatedPagesTarget = await generateAllPageTypes({
      home,
      iterator: 1,
      tenant,
      time,
    });

    // 1. loop: iterate over all pages, these act as link targets
    // 2. loop: iterate over all pages, these link to the target (source)
    for (const [
      indexLinkTarget,
      collectionSlugLinkTarget,
    ] of Object.keys(generatedPagesTarget)
        .entries()) {
      const generatedPagesSource = await generateAllPageTypes({
        home,
        iterator: indexLinkTarget + 2,
        tenant,
        time,
      });

      for (const [
        indexLinkSource,
        collectionSlugLinkSource,
      ] of Object.keys(generatedPagesSource)
          .entries()) {

        const targetPage = generatedPagesTarget[collectionSlugLinkTarget as keyof typeof generatedPagesTarget];
        const sourcePage = generatedPagesSource[collectionSlugLinkSource as keyof typeof generatedPagesSource];

        // if target page is overview, we can not change the slug of the parent
        // page, since this is the home page which has a fixed slug.
        if (targetPage.parentPage?.slug === 'homePage') {
          break;
        }

        // prepare content for source page
        let contentBlocksData: any = {
          content: [
            {
              blockType: 'textBlock',
              text: sampleRteWithLink({
                documentId: targetPage.id,
                slug: collectionSlugLinkTarget,
                text: '[test]rte:link',
              }),
            },
          ],
        };

        let emptyContentBlocksData: any = {
          content: [],
        };

        if (collectionSlugLinkSource === 'eventDetailPage') {
          contentBlocksData = {
            blocks: {
              content: [
                {
                  blockType: 'textBlock',
                  text: sampleRteWithLink({
                    documentId: targetPage.id,
                    slug: collectionSlugLinkTarget,
                    text: '[test]rte:link',
                  }),
                },
              ],
            },
          };

          emptyContentBlocksData = {
            blocks: {
              content: [],
            },
          };
        }

        // add content to source page
        await payload.update({
          collection: collectionSlugLinkSource as CollectionSlug,
          data: contentBlocksData,
          id: sourcePage.id,
        });

        logCapture.captureLogs();

        // update parent page of target page
        await payload.update({
          collection: targetPage.parentPage?.slug as CollectionSlug,
          data: {
            slug: `parent-page-of-target-changed-${time}-${indexLinkSource}-${indexLinkTarget}`,
          },
          id: targetPage.parentPage?.documentId || '',
          locale: 'de',
        }) as any;

        logCapture.detachLogs();

        // expect invalidation for source page
        const parentPageOfSourcePage = await payload.findByID({
          collection: sourcePage.parentPage?.slug as CollectionSlug,
          id: sourcePage.parentPage?.documentId || '',
          locale: 'all',
        }) as any;

        const expectedUrl = parentPageOfSourcePage.slug.de === 'home'
          ? `${sourcePage.slug}`
          : `${parentPageOfSourcePage.slug.de}/${sourcePage.slug}`;

        expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${expectedUrl}`))
          .toBe(true);
        expect(logCapture.logs)
          .toHaveLength(2);

        // remove content from source page
        await payload.update({
          collection: collectionSlugLinkSource as CollectionSlug,
          data: emptyContentBlocksData,
          id: sourcePage.id,
        });

      }
    }
  });
});

test.describe('Hook triggers on all page types (non-sagw)', () => {
  test('if slug of target changes', {
    tag: '@cache',
  }, async () => {
    await deleteSetsPages();

    const logCapture = new LogCapture();
    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();
    const tenant = await getTenantId({
      isSagw: false,
      time,
    });
    const tenantObject = await getTenantOfId({
      id: tenant,
    });
    const home = await getHomeId({
      isSagw: false,
      tenant,
    });

    const generatedPagesTarget = await generateAllPageTypes({
      home,
      iterator: 1,
      tenant,
      time,
    });

    // 1. loop: iterate over all pages, these act as link targets
    // 2. loop: iterate over all pages, these link to the target (source)
    for (const [
      indexLinkTarget,
      collectionSlugLinkTarget,
    ] of Object.keys(generatedPagesTarget)
        .entries()) {

      const generatedPagesSource = await generateAllPageTypes({
        home,
        iterator: indexLinkTarget + 2,
        tenant,
        time,
      });

      for (const [
        indexLinkSource,
        collectionSlugLinkSource,
      ] of Object.keys(generatedPagesSource)
          .entries()) {
        const targetPage = generatedPagesTarget[collectionSlugLinkTarget as keyof typeof generatedPagesTarget];
        const sourcePage = generatedPagesSource[collectionSlugLinkSource as keyof typeof generatedPagesSource];

        // prepare content for source page
        let contentBlocksData: any = {
          content: [
            {
              blockType: 'textBlock',
              text: sampleRteWithLink({
                documentId: targetPage.id,
                slug: collectionSlugLinkTarget,
                text: '[test]rte:link',
              }),
            },
          ],
        };

        let emptyContentBlocksData: any = {
          content: [],
        };

        if (collectionSlugLinkSource === 'eventDetailPage') {
          contentBlocksData = {
            blocks: {
              content: [
                {
                  blockType: 'textBlock',
                  text: sampleRteWithLink({
                    documentId: targetPage.id,
                    slug: collectionSlugLinkTarget,
                    text: '[test]rte:link',
                  }),
                },
              ],
            },
          };

          emptyContentBlocksData = {
            blocks: {
              content: [],
            },
          };
        }

        // add content to source page
        await payload.update({
          collection: collectionSlugLinkSource as CollectionSlug,
          data: contentBlocksData,
          id: sourcePage.id,
        });

        logCapture.captureLogs();

        // update target page
        await payload.update({
          collection: collectionSlugLinkTarget as CollectionSlug,
          data: {
            slug: `${collectionSlugLinkTarget}-linked-${time}-${indexLinkTarget + 1}-${indexLinkSource + 1}`,
          },
          id: targetPage.id,
        });

        logCapture.detachLogs();

        // expect invalidation for source page

        const parentPageOfSourcePage = await payload.findByID({
          collection: sourcePage.parentPage?.slug as CollectionSlug,
          id: sourcePage.parentPage?.documentId || '',
          locale: 'all',
        }) as any;

        const expectedUrl = parentPageOfSourcePage.slug.de === 'home'
          ? `${tenantObject.slug.de}/${sourcePage.slug}`
          : `${tenantObject.slug.de}/${parentPageOfSourcePage.slug.de}/${sourcePage.slug}`;

        expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${expectedUrl}`))
          .toBe(true);

        expect(logCapture.logs)
          .toHaveLength(2);

        // remove content from source page
        await payload.update({
          collection: collectionSlugLinkSource as CollectionSlug,
          data: emptyContentBlocksData,
          id: sourcePage.id,
        });

      }
    }
  });

  test('if slug of target changes in another locale', {
    tag: '@cache',
  }, async () => {
    await deleteSetsPages();
    const logCapture = new LogCapture();
    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();
    const tenant = await getTenantId({
      isSagw: false,
      time,
    });
    const tenantObject = await getTenantOfId({
      id: tenant,
    });
    const home = await getHomeId({
      isSagw: false,
      tenant,
    });

    const generatedPagesTarget = await generateAllPageTypes({
      home,
      iterator: 1,
      tenant,
      time,
    });

    // 1. loop: iterate over all pages, these act as link targets
    // 2. loop: iterate over all pages, these link to the target (source)
    for (const [
      indexLinkTarget,
      collectionSlugLinkTarget,
    ] of Object.keys(generatedPagesTarget)
        .entries()) {

      const generatedPagesSource = await generateAllPageTypes({
        home,
        iterator: indexLinkTarget + 2,
        tenant,
        time,
      });

      for (const [
        indexLinkSource,
        collectionSlugLinkSource,
      ] of Object.keys(generatedPagesSource)
          .entries()) {

        const targetPage = generatedPagesTarget[collectionSlugLinkTarget as keyof typeof generatedPagesTarget];
        const sourcePage = generatedPagesSource[collectionSlugLinkSource as keyof typeof generatedPagesSource];

        // prepare content for source page
        let contentBlocksData: any = {
          content: [
            {
              blockType: 'textBlock',
              text: sampleRteWithLink({
                documentId: targetPage.id,
                slug: collectionSlugLinkTarget,
                text: '[test]rte:link',
              }),
            },
          ],
        };

        let emptyContentBlocksData: any = {
          content: [],
        };

        if (collectionSlugLinkSource === 'eventDetailPage') {
          contentBlocksData = {
            blocks: {
              content: [
                {
                  blockType: 'textBlock',
                  text: sampleRteWithLink({
                    documentId: targetPage.id,
                    slug: collectionSlugLinkTarget,
                    text: '[test]rte:link',
                  }),
                },
              ],
            },
          };

          emptyContentBlocksData = {
            blocks: {
              content: [],
            },
          };
        }

        // add content to source page
        await payload.update({
          collection: collectionSlugLinkSource as CollectionSlug,
          data: contentBlocksData,
          id: sourcePage.id,
        });

        logCapture.captureLogs();

        // update target page
        await payload.update({
          collection: collectionSlugLinkTarget as CollectionSlug,
          data: {
            slug: `${collectionSlugLinkTarget}-linked-${time}-${indexLinkTarget + 1}-${indexLinkSource + 1}`,
          },
          id: targetPage.id,
          locale: 'it',
        });

        logCapture.detachLogs();

        // expect invalidation for source page

        const parentPageOfSourcePage = await payload.findByID({
          collection: sourcePage.parentPage?.slug as CollectionSlug,
          id: sourcePage.parentPage?.documentId || '',
          locale: 'all',
        }) as any;

        const expectedUrl = parentPageOfSourcePage.slug.de === 'home'
          ? `${tenantObject.slug.it}/${sourcePage.slug}`
          : `${tenantObject.slug.it}/${parentPageOfSourcePage.slug.it}/${sourcePage.slug}`;

        expect(logCapture.hasLog(`[CACHE] invalidating path: /it/${expectedUrl}`))
          .toBe(true);

        expect(logCapture.logs)
          .toHaveLength(2);

        // remove content from source page
        await payload.update({
          collection: collectionSlugLinkSource as CollectionSlug,
          data: emptyContentBlocksData,
          id: sourcePage.id,
        });

      }
    }
  });

  test('if parent page of target changes', {
    tag: '@cache',
  }, async () => {
    await deleteSetsPages();
    const logCapture = new LogCapture();
    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();
    const tenant = await getTenantId({
      isSagw: false,
      time,
    });
    const tenantObject = await getTenantOfId({
      id: tenant,
    });
    const home = await getHomeId({
      isSagw: false,
      tenant,
    });

    const generatedPagesTarget = await generateAllPageTypes({
      home,
      iterator: 1,
      tenant,
      time,
    });

    // 1. loop: iterate over all pages, these act as link targets
    // 2. loop: iterate over all pages, these link to the target (source)
    for (const [
      indexLinkTarget,
      collectionSlugLinkTarget,
    ] of Object.keys(generatedPagesTarget)
        .entries()) {
      const generatedPagesSource = await generateAllPageTypes({
        home,
        iterator: indexLinkTarget + 2,
        tenant,
        time,
      });

      for (const [
        indexLinkSource,
        collectionSlugLinkSource,
      ] of Object.keys(generatedPagesSource)
          .entries()) {

        const targetPage = generatedPagesTarget[collectionSlugLinkTarget as keyof typeof generatedPagesTarget];
        const sourcePage = generatedPagesSource[collectionSlugLinkSource as keyof typeof generatedPagesSource];
        const oldParentPage = targetPage.parentPage;
        const newParentPage = await generateOverviewPage({
          navigationTitle: `parent page ${time} ${indexLinkTarget + 1} ${indexLinkSource + 1}`,
          parentPage: {
            documentId: home,
            slug: 'homePage',
          },
          title: `parent page ${time} ${indexLinkTarget + 1} ${indexLinkSource + 1}`,
        });

        await payload.update({
          collection: 'overviewPage',
          data: {
            hero: {
              title: simpleRteConfig(`parent page ${time} ${indexLinkTarget + 1} ${indexLinkSource + 1} it`),
            },
            navigationTitle: `parent page ${time} ${indexLinkTarget + 1} ${indexLinkSource + 1} it`,
          },
          id: newParentPage.id,
          locale: 'it',
        });

        // prepare content for source page
        let contentBlocksData: any = {
          content: [
            {
              blockType: 'textBlock',
              text: sampleRteWithLink({
                documentId: targetPage.id,
                slug: collectionSlugLinkTarget,
                text: '[test]rte:link',
              }),
            },
          ],
        };

        let emptyContentBlocksData: any = {
          content: [],
        };

        if (collectionSlugLinkSource === 'eventDetailPage') {
          contentBlocksData = {
            blocks: {
              content: [
                {
                  blockType: 'textBlock',
                  text: sampleRteWithLink({
                    documentId: targetPage.id,
                    slug: collectionSlugLinkTarget,
                    text: '[test]rte:link',
                  }),
                },
              ],
            },
          };

          emptyContentBlocksData = {
            blocks: {
              content: [],
            },
          };
        }

        // add content to source page
        await payload.update({
          collection: collectionSlugLinkSource as CollectionSlug,
          data: contentBlocksData,
          id: sourcePage.id,
        });

        // overview can not have overview as parent. it can only have home
        // as parent, thus we can not change the parnet of overview in this,
        // test, thus we skip it.
        if (collectionSlugLinkTarget === 'overviewPage') {
          break;
        }

        logCapture.captureLogs();

        // update target page
        await payload.update({
          collection: collectionSlugLinkTarget as CollectionSlug,
          data: {
            parentPage: {
              documentId: newParentPage.id,
              slug: 'overviewPage',
            },
          },
          id: targetPage.id,
        });

        logCapture.detachLogs();

        // expect invalidation for source page
        const parentPageOfSourcePage = await payload.findByID({
          collection: sourcePage.parentPage?.slug as CollectionSlug,
          id: sourcePage.parentPage?.documentId || '',
          locale: 'all',
        }) as any;

        const expectedInvalidationPathForPageDe = parentPageOfSourcePage.slug.de === 'home'
          ? `${tenantObject.slug.de}/${sourcePage.slug}`
          : `${tenantObject.slug.de}/${parentPageOfSourcePage.slug.de}/${sourcePage.slug}`;

        const expectedInvalidationPathForPageIt = parentPageOfSourcePage.slug.de === 'home'
          ? `${tenantObject.slug.it}/${sourcePage.slug}`
          : `${tenantObject.slug.it}/${parentPageOfSourcePage.slug.it}/${sourcePage.slug}`;

        expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${expectedInvalidationPathForPageDe}`))
          .toBe(true);
        expect(logCapture.hasLog(`[CACHE] invalidating path: /it/${expectedInvalidationPathForPageIt}`))
          .toBe(true);
        expect(logCapture.logs)
          .toHaveLength(2);

        // reset parent page on target
        await payload.update({
          collection: collectionSlugLinkTarget as CollectionSlug,
          data: {
            parentPage: oldParentPage,
          },
          id: targetPage.id,
        });

        // remove content from source page
        await payload.update({
          collection: collectionSlugLinkSource as CollectionSlug,
          data: emptyContentBlocksData,
          id: sourcePage.id,
        });

      }
    }
  });

  test('if parent page of target changes slug', {
    tag: '@cache',
  }, async () => {
    await deleteSetsPages();
    const logCapture = new LogCapture();
    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();
    const tenant = await getTenantId({
      isSagw: false,
      time,
    });
    const tenantObject = await getTenantOfId({
      id: tenant,
    });
    const home = await getHomeId({
      isSagw: false,
      tenant,
    });

    const generatedPagesTarget = await generateAllPageTypes({
      home,
      iterator: 1,
      tenant,
      time,
    });

    // 1. loop: iterate over all pages, these act as link targets
    // 2. loop: iterate over all pages, these link to the target (source)
    for (const [
      indexLinkTarget,
      collectionSlugLinkTarget,
    ] of Object.keys(generatedPagesTarget)
        .entries()) {
      const generatedPagesSource = await generateAllPageTypes({
        home,
        iterator: indexLinkTarget + 2,
        tenant,
        time,
      });

      for (const [
        indexLinkSource,
        collectionSlugLinkSource,
      ] of Object.keys(generatedPagesSource)
          .entries()) {

        const targetPage = generatedPagesTarget[collectionSlugLinkTarget as keyof typeof generatedPagesTarget];
        const sourcePage = generatedPagesSource[collectionSlugLinkSource as keyof typeof generatedPagesSource];

        // if target page is overview, we can not change the slug of the parent
        // page, since this is the home page which has a fixed slug.
        if (targetPage.parentPage?.slug === 'homePage') {
          break;
        }

        // prepare content for source page
        let contentBlocksData: any = {
          content: [
            {
              blockType: 'textBlock',
              text: sampleRteWithLink({
                documentId: targetPage.id,
                slug: collectionSlugLinkTarget,
                text: '[test]rte:link',
              }),
            },
          ],
        };

        let emptyContentBlocksData: any = {
          content: [],
        };

        if (collectionSlugLinkSource === 'eventDetailPage') {
          contentBlocksData = {
            blocks: {
              content: [
                {
                  blockType: 'textBlock',
                  text: sampleRteWithLink({
                    documentId: targetPage.id,
                    slug: collectionSlugLinkTarget,
                    text: '[test]rte:link',
                  }),
                },
              ],
            },
          };

          emptyContentBlocksData = {
            blocks: {
              content: [],
            },
          };
        }

        // add content to source page
        await payload.update({
          collection: collectionSlugLinkSource as CollectionSlug,
          data: contentBlocksData,
          id: sourcePage.id,
        });

        logCapture.captureLogs();

        // update parent page of target page
        await payload.update({
          collection: targetPage.parentPage?.slug as CollectionSlug,
          data: {
            slug: `parent-page-of-target-changed-${time}-${indexLinkSource}-${indexLinkTarget}`,
          },
          id: targetPage.parentPage?.documentId || '',
          locale: 'de',
        }) as any;

        logCapture.detachLogs();

        // expect invalidation for source page
        const parentPageOfSourcePage = await payload.findByID({
          collection: sourcePage.parentPage?.slug as CollectionSlug,
          id: sourcePage.parentPage?.documentId || '',
          locale: 'all',
        }) as any;

        const expectedUrl = parentPageOfSourcePage.slug.de === 'home'
          ? `${tenantObject.slug.de}/${sourcePage.slug}`
          : `${tenantObject.slug.de}/${parentPageOfSourcePage.slug.de}/${sourcePage.slug}`;

        expect(logCapture.hasLog(`[CACHE] invalidating path: /de/${expectedUrl}`))
          .toBe(true);
        expect(logCapture.logs)
          .toHaveLength(2);

        // remove content from source page
        await payload.update({
          collection: collectionSlugLinkSource as CollectionSlug,
          data: emptyContentBlocksData,
          id: sourcePage.id,
        });

      }
    }
  });
});
