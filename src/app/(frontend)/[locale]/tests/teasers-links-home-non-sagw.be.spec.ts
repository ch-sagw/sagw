// Test if links in teasers are rendered correctly in various languages

import {
  expect,
  test,
} from '@playwright/test';
import {
  generateConsentData,
  generateDataPrivacyPage,
  generateDetailPage,
  generateEventDetailPage,
  generateFooterData,
  generateHeaderData,
  generateHomePage,
  generateI18nData,
  generateImpressumPage,
  generateMagazineDetailPage,
  generateNewsDetailPage,
  generateOverviewPage,
  generateProjectDetailPage,
} from '@/test-helpers/collections-generator';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { generateTenant } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';

test.describe('Teasers links (non-sagw)', () => {
  beforeEachAcceptCookies();
  test('rendered correctly', {
    tag: '@linking',
  }, async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

    let eventPage1;
    let eventPage2;
    let newsPage1;
    let newsPage2;
    let projectPage1;
    let projectPage2;
    let magazinePage1;
    let magazinePage2;
    let detail1;
    let detail2;
    let detail3;
    let detail5;
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

      detail1 = await generateDetailPage({
        navigationTitle: 'd1',
        parentPage: {
          documentId: level1a.id,
          slug: 'overviewPage',
        },
        tenant: tenant.id,
        title: `d1 ${time}`,
      });

      detail2 = await generateDetailPage({
        navigationTitle: 'd2',
        parentPage: {
          documentId: detail1.id,
          slug: 'detailPage',
        },
        tenant: tenant.id,
        title: `d2 ${time}`,
      });

      detail3 = await generateDetailPage({
        navigationTitle: 'd3',
        parentPage: {
          documentId: detail2.id,
          slug: 'detailPage',
        },
        tenant: tenant.id,
        title: `d3 ${time}`,
      });

      const detail4 = await generateDetailPage({
        navigationTitle: 'd4',
        parentPage: {
          documentId: detail3.id,
          slug: 'detailPage',
        },
        tenant: tenant.id,
        title: `d4 ${time}`,
      });

      detail5 = await generateDetailPage({
        navigationTitle: 'd5',
        parentPage: {
          documentId: detail4.id,
          slug: 'detailPage',
        },
        tenant: tenant.id,
        title: `d5 ${time}`,
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
      // Update with italian
      // #########################################

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

      await payload.update({
        collection: 'detailPage',
        data: {
          hero: {
            title: simpleRteConfig(`d3-it-${time}`),
          },
          navigationTitle: 'd3 it',
        },
        id: detail3.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'detailPage',
        data: {
          hero: {
            title: simpleRteConfig(`d4-it-${time}`),
          },
          navigationTitle: 'd4 it',
        },
        id: detail4.id,
        locale: 'it',
      });

      await payload.update({
        collection: 'detailPage',
        data: {
          hero: {
            title: simpleRteConfig(`d5-it-${time}`),
          },
          navigationTitle: 'd5 it',
        },
        id: detail5.id,
        locale: 'it',
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
          navigationTitle: 'nav title',
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
          navigationTitle: 'nav title',
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
          navigationTitle: 'nav title',
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
          navigationTitle: 'nav title',
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
          navigationTitle: 'nav title',
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
          navigationTitle: 'nav title',
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
          navigationTitle: 'nav title',
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
          navigationTitle: 'nav title',
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
              optionalLink: {
                includeLink: true,
                link: {
                  internalLink: {
                    documentId: detail1.id,
                    slug: 'detailPage',
                  },
                  linkText: simpleRteConfig('[test]eventsTeasers:link'),
                },
              },
              title: simpleRteConfig('Events'),
            },
            {
              blockType: 'newsTeasersBlock',
              colorMode: 'light',
              optionalLink: {
                includeLink: true,
                link: {
                  internalLink: {
                    documentId: detail2.id,
                    slug: 'detailPage',
                  },
                  linkText: simpleRteConfig('[test]newsTeasers:link'),
                },
              },
              title: simpleRteConfig('News'),
            },
            {
              blockType: 'magazineTeasersBlock',
              optionalLink: {
                includeLink: true,
                link: {
                  internalLink: {
                    documentId: detail3.id,
                    slug: 'detailPage',
                  },
                  linkText: simpleRteConfig('[test]magazineTeasers:link'),
                },
              },
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
              optionalLink: {
                includeLink: true,
                link: {
                  internalLink: {
                    documentId: detail5.id,
                    slug: 'detailPage',
                  },
                  linkText: simpleRteConfig('[test]projectsTeasers:link'),
                },
              },
              title: simpleRteConfig('News'),
            },
          ],
        },
        id: homeId,
      });

      // #########################################
      // add remainig home data
      // #########################################
      await generateFooterData({
        tenant: tenant.id,
      });

      await generateI18nData({
        tenant: tenant.id,
      });

      await generateConsentData({
        tenant: tenant.id,
      });

      await generateImpressumPage({
        tenant: tenant.id,
      });

      await generateDataPrivacyPage({
        tenant: tenant.id,
      });

      await generateHeaderData({
        tenant: tenant.id,
      });

    } catch (e) {
      throw new Error(e instanceof Error
        ? e.message
        : String(e));
    }

    // #########################################
    // verify correct url rendering: de
    // #########################################
    await page.goto(`http://localhost:3000/de/tenant-${time}`);
    await page.waitForLoadState('networkidle');

    const eventsTeasersLink = await page.getByRole('link', {
      name: '[test]eventsTeasers:link',
    })
      .getAttribute('href');

    const newsTeasersLink = await page.getByRole('link', {
      name: '[test]newsTeasers:link',
    })
      .getAttribute('href');

    const magazineTeasersLink = await page.getByRole('link', {
      name: '[test]magazineTeasers:link',
    })
      .getAttribute('href');

    // const publicationsTeasersLink = await page.getByRole('link', {
    //   name: '[test]publicationsTeasers:link',
    // })
    //   .getAttribute('href');

    const projectsTeasersLink = await page.getByRole('link', {
      name: '[test]projectsTeasers:link',
    })
      .getAttribute('href');

    const eventLink1 = await page.getByRole('link', {
      name: `e1 ${time}`,
    })
      .getAttribute('href');

    const eventLink2 = await page.getByRole('link', {
      name: `e2 ${time}`,
    })
      .getAttribute('href');

    const newsLink1 = await page.getByRole('link', {
      name: `n1 ${time}`,
    })
      .getAttribute('href');

    const newsLink2 = await page.getByRole('link', {
      name: `n2 ${time}`,
    })
      .getAttribute('href');

    const projectLink1 = await page.getByRole('link', {
      name: `p1 ${time}`,
    })
      .getAttribute('href');

    const projectLink2 = await page.getByRole('link', {
      name: `p2 ${time}`,
    })
      .getAttribute('href');

    const magazineLink1 = await page.getByRole('link', {
      name: `m1 ${time}`,
    })
      .getAttribute('href');

    const magazineLink2 = await page.getByRole('link', {
      name: `m2 ${time}`,
    })
      .getAttribute('href');

    await expect(eventsTeasersLink)
      .toBe(`/de/tenant-${time}/overview-page-1-${time}/d1-${time}`);
    await expect(newsTeasersLink)
      .toBe(`/de/tenant-${time}/overview-page-1-${time}/d1-${time}/d2-${time}`);
    await expect(magazineTeasersLink)
      .toBe(`/de/tenant-${time}/overview-page-1-${time}/d1-${time}/d2-${time}/d3-${time}`);
    // await expect(publicationsTeasersLink)
    //   .toBe(`/de/overview-page-1-${time}/d1-${time}/d2-${time}/d3-${time}
    // /d4-${time}/d5-${time}/d2-${time}/d3-${time}/d8-${time}`);
    await expect(projectsTeasersLink)
      .toBe(`/de/tenant-${time}/overview-page-1-${time}/d1-${time}/d2-${time}/d3-${time}/d4-${time}/d5-${time}`);

    await expect(newsLink1)
      .toStrictEqual(`/de/tenant-${time}/overview-page-1-${time}/n1-${time}`);
    await expect(newsLink2)
      .toStrictEqual(`/de/tenant-${time}/overview-page-1-${time}/n1-${time}/n2-${time}`);
    await expect(eventLink1)
      .toStrictEqual(`/de/tenant-${time}/overview-page-1-${time}/e1-${time}`);
    await expect(eventLink2)
      .toStrictEqual(`/de/tenant-${time}/overview-page-1-${time}/e1-${time}/e2-${time}`);
    await expect(magazineLink1)
      .toStrictEqual(`/de/tenant-${time}/overview-page-1-${time}/m1-${time}`);
    await expect(magazineLink2)
      .toStrictEqual(`/de/tenant-${time}/overview-page-1-${time}/m1-${time}/m2-${time}`);
    await expect(projectLink1)
      .toStrictEqual(`/de/tenant-${time}/overview-page-1-${time}/p1-${time}`);
    await expect(projectLink2)
      .toStrictEqual(`/de/tenant-${time}/overview-page-1-${time}/p1-${time}/p2-${time}`);

    // #########################################
    // verify correct url rendering: it
    // #########################################
    await page.goto(`http://localhost:3000/it/tenant-${time}-it`);
    await page.waitForLoadState('networkidle');

    const eventsTeasersLinkIt = await page.getByRole('link', {
      name: '[test]eventsTeasers:link',
    })
      .getAttribute('href');

    const newsTeasersLinkIt = await page.getByRole('link', {
      name: '[test]newsTeasers:link',
    })
      .getAttribute('href');

    const magazineTeasersLinkIt = await page.getByRole('link', {
      name: '[test]magazineTeasers:link',
    })
      .getAttribute('href');

    // const publicationsTeasersLink = await page.getByRole('link', {
    //   name: '[test]publicationsTeasers:link',
    // })
    //   .getAttribute('href');

    const projectsTeasersLinkIt = await page.getByRole('link', {
      name: '[test]projectsTeasers:link',
    })
      .getAttribute('href');

    const eventLink1It = await page.getByRole('link', {
      name: `e1 it ${time}`,
    })
      .getAttribute('href');

    const eventLink2It = await page.getByRole('link', {
      name: `e2 it ${time}`,
    })
      .getAttribute('href');

    const newsLink1It = await page.getByRole('link', {
      name: `n1 it ${time}`,
    })
      .getAttribute('href');

    const newsLink2It = await page.getByRole('link', {
      name: `n2 it ${time}`,
    })
      .getAttribute('href');

    const projectLink1It = await page.getByRole('link', {
      name: `p1 it ${time}`,
    })
      .getAttribute('href');

    const projectLink2It = await page.getByRole('link', {
      name: `p2 it ${time}`,
    })
      .getAttribute('href');

    const magazineLink1It = await page.getByRole('link', {
      name: `m1 it ${time}`,
    })
      .getAttribute('href');

    const magazineLink2It = await page.getByRole('link', {
      name: `m2 it ${time}`,
    })
      .getAttribute('href');

    await expect(eventsTeasersLinkIt)
      .toBe(`/it/tenant-${time}-it/overview-page-1-it-${time}/d1-it-${time}`);
    await expect(newsTeasersLinkIt)
      .toBe(`/it/tenant-${time}-it/overview-page-1-it-${time}/d1-it-${time}/d2-it-${time}`);
    await expect(magazineTeasersLinkIt)
      .toBe(`/it/tenant-${time}-it/overview-page-1-it-${time}/d1-it-${time}/d2-it-${time}/d3-it-${time}`);
    // await expect(publicationsTeasersLinkIt)
    //   .toBe(`/it/overview-page-1-it-${time}/d1-it-${time}/d2-it-${time}/
    // d3-it-${time}
    // /d4-it-${time}/d5-it-${time}/d6-it-${time}/d7-it-${time}/d8-${time}`);
    await expect(projectsTeasersLinkIt)
      .toBe(`/it/tenant-${time}-it/overview-page-1-it-${time}/d1-it-${time}/d2-it-${time}/d3-it-${time}/d4-it-${time}/d5-it-${time}`);

    await expect(newsLink1It)
      .toStrictEqual(`/it/tenant-${time}-it/overview-page-1-it-${time}/n1-it-${time}`);
    await expect(newsLink2It)
      .toStrictEqual(`/it/tenant-${time}-it/overview-page-1-it-${time}/n1-it-${time}/n2-it-${time}`);
    await expect(eventLink1It)
      .toStrictEqual(`/it/tenant-${time}-it/overview-page-1-it-${time}/e1-it-${time}`);
    await expect(eventLink2It)
      .toStrictEqual(`/it/tenant-${time}-it/overview-page-1-it-${time}/e1-it-${time}/e2-it-${time}`);
    await expect(magazineLink1It)
      .toStrictEqual(`/it/tenant-${time}-it/overview-page-1-it-${time}/m1-it-${time}`);
    await expect(magazineLink2It)
      .toStrictEqual(`/it/tenant-${time}-it/overview-page-1-it-${time}/m1-it-${time}/m2-it-${time}`);
    await expect(projectLink1It)
      .toStrictEqual(`/it/tenant-${time}-it/overview-page-1-it-${time}/p1-it-${time}`);
    await expect(projectLink2It)
      .toStrictEqual(`/it/tenant-${time}-it/overview-page-1-it-${time}/p1-it-${time}/p2-it-${time}`);

    // #########################################
    // cleanup
    // #########################################

    // delete teasers pages to not disturb repetitive tests
    await payload.delete({
      collection: 'eventDetailPage',
      id: eventPage1.id,
    });

    await payload.delete({
      collection: 'eventDetailPage',
      id: eventPage2.id,
    });

    await payload.delete({
      collection: 'newsDetailPage',
      id: newsPage1.id,
    });

    await payload.delete({
      collection: 'newsDetailPage',
      id: newsPage2.id,
    });

    await payload.delete({
      collection: 'projectDetailPage',
      id: projectPage1.id,
    });

    await payload.delete({
      collection: 'projectDetailPage',
      id: projectPage2.id,
    });

    await payload.delete({
      collection: 'magazineDetailPage',
      id: magazinePage1.id,
    });

    await payload.delete({
      collection: 'magazineDetailPage',
      id: magazinePage2.id,
    });
  });
});
