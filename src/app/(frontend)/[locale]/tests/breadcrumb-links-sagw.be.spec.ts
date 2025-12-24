import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  generateInstituteDetailPage,
  generateMagazineDetailPage,
  generateNationalDictionaryDetailPage,
  generateNewsDetailPage,
  generateOverviewPage,
  generateProjectDetailPage,
  generatePublicationDetailPage,
} from '@/test-helpers/page-generator';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { getTenant } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';

test.describe('Breadcrumb links (sagw)', () => {
  beforeEachAcceptCookies();
  test('rendered correctly', {
    tag: '@breadcrumb',
  }, async ({
    page,
  }) => {
    const payload = await getPayloadCached();
    const tenant = await getTenant();
    const time = (new Date())
      .getTime();

    try {
      const home = await payload.find({
        collection: 'homePage',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      // #########################################
      // Generate pages to link to
      // #########################################

      const o1 = await generateOverviewPage({
        navigationTitle: '[test]link:o1',
        parentPage: {
          documentId: home.docs[0].id,
          slug: 'homePage',
        },
        title: `o1 ${time}`,
      });

      await payload.update({
        collection: 'overviewPage',
        data: {
          hero: {
            title: simpleRteConfig(`o1 it ${time}`),
          },
          navigationTitle: '[test]link:o1-it',
        },
        id: o1.id,
        locale: 'it',
      });

      const d1 = await generateDetailPage({
        navigationTitle: '[test]link:d1',
        parentPage: {
          documentId: o1.id,
          slug: 'overviewPage',
        },
        title: `d1 ${time}`,
      });

      await payload.update({
        collection: 'detailPage',
        data: {
          hero: {
            title: simpleRteConfig(`d1 it ${time}`),
          },
          navigationTitle: '[test]link:d1-it',
        },
        id: d1.id,
        locale: 'it',
      });

      const d2 = await generateNewsDetailPage({
        navigationTitle: '[test]link:d2',
        parentPage: {
          documentId: d1.id,
          slug: 'detailPage',
        },
        title: `d2 ${time}`,
      });

      await payload.update({
        collection: 'newsDetailPage',
        data: {
          hero: {
            title: simpleRteConfig(`d2 it ${time}`),
          },
          navigationTitle: '[test]link:d2-it',
          overviewPageProps: {
            teaserText: simpleRteConfig('some text'),
          },
        },
        id: d2.id,
        locale: 'it',
      });

      const d3 = await generateInstituteDetailPage({
        navigationTitle: '[test]link:d3',
        parentPage: {
          documentId: d2.id,
          slug: 'newsDetailPage',
        },
        title: `d3 ${time}`,
      });

      await payload.update({
        collection: 'instituteDetailPage',
        data: {
          hero: {
            title: simpleRteConfig(`d3 it ${time}`),
          },
          navigationTitle: '[test]link:d3-it',
          overviewPageProps: d3.overviewPageProps,
        },
        id: d3.id,
        locale: 'it',
      });

      const d4 = await generateMagazineDetailPage({
        navigationTitle: '[test]link:d4',
        parentPage: {
          documentId: d3.id,
          slug: 'instituteDetailPage',
        },
        title: `d4 ${time}`,
      });

      await payload.update({
        collection: 'magazineDetailPage',
        data: {
          hero: {
            ...d4.hero,
            title: simpleRteConfig(`d4 it ${time}`),
          },
          navigationTitle: '[test]link:d4-it',
          overviewPageProps: {
            teaserText: simpleRteConfig('some text'),
          },
        },
        id: d4.id,
        locale: 'it',
      });

      const d5 = await generateNationalDictionaryDetailPage({
        navigationTitle: '[test]link:d5',
        parentPage: {
          documentId: d4.id,
          slug: 'magazineDetailPage',
        },
        title: `d5 ${time}`,
      });

      await payload.update({
        collection: 'nationalDictionaryDetailPage',
        data: {
          hero: {
            title: simpleRteConfig(`d5 it ${time}`),
          },
          navigationTitle: '[test]link:d5-it',
          overviewPageProps: {
            teaserText: simpleRteConfig('some text'),
          },
        },
        id: d5.id,
        locale: 'it',
      });

      const d6 = await generateProjectDetailPage({
        navigationTitle: '[test]link:d6',
        parentPage: {
          documentId: d5.id,
          slug: 'nationalDictionaryDetailPage',
        },
        title: `d6 ${time}`,
      });

      await payload.update({
        collection: 'projectDetailPage',
        data: {
          hero: {
            title: simpleRteConfig(`d6 it ${time}`),
          },
          navigationTitle: '[test]link:d6-it',
          overviewPageProps: {
            linkText: simpleRteConfig('some text'),
            teaserText: simpleRteConfig('some text'),
          },
          project: d6.project,
        },
        id: d6.id,
        locale: 'it',
      });

      const d7 = await generatePublicationDetailPage({
        navigationTitle: '[test]link:d7',
        parentPage: {
          documentId: d6.id,
          slug: 'projectDetailPage',
        },
        title: `d7 ${time}`,
      });

      await payload.update({
        collection: 'publicationDetailPage',
        data: {
          hero: {
            title: simpleRteConfig(`d7 it ${time}`),
          },
          navigationTitle: '[test]link:d7-it',
          overviewPageProps: d7.overviewPageProps,
        },
        id: d7.id,
        locale: 'it',
      });

    } catch (e) {
      throw new Error(e instanceof Error
        ? e.message
        : String(e));
    }

    // #########################################
    // verify correct url rendering: de
    // #########################################
    await page.goto(`http://localhost:3000/de/o1-${time}/d1-${time}/d2-${time}/d3-${time}/d4-${time}/d5-${time}/d6-${time}/d7-${time}`);
    await page.waitForLoadState('networkidle');

    const linkHome = await page.getByRole('link', {
      name: 'Home DE',
    })
      .getAttribute('href');

    const link1 = await page.getByRole('link', {
      name: '[test]link:o1',
    })
      .getAttribute('href');

    const link2 = await page.getByRole('link', {
      name: '[test]link:d1',
    })
      .getAttribute('href');

    const link3 = await page.getByRole('link', {
      name: '[test]link:d2',
    })
      .getAttribute('href');

    const link4 = await page.getByRole('link', {
      name: '[test]link:d3',
    })
      .getAttribute('href');

    const link5 = await page.getByRole('link', {
      name: '[test]link:d4',
    })
      .getAttribute('href');

    const link6 = await page.getByRole('link', {
      name: '[test]link:d5',
    })
      .getAttribute('href');

    const link7 = await page.getByRole('link', {
      name: '[test]link:d6',
    })
      .getAttribute('href');

    const link8 = await page.getByRole('link', {
      name: '[test]link:d7',
    });

    await expect(linkHome)
      .toStrictEqual('/de');

    await expect(link1)
      .toStrictEqual(`/de/o1-${time}`);

    await expect(link2)
      .toStrictEqual(`/de/o1-${time}/d1-${time}`);

    await expect(link3)
      .toStrictEqual(`/de/o1-${time}/d1-${time}/d2-${time}`);

    await expect(link4)
      .toStrictEqual(`/de/o1-${time}/d1-${time}/d2-${time}/d3-${time}`);

    await expect(link5)
      .toStrictEqual(`/de/o1-${time}/d1-${time}/d2-${time}/d3-${time}/d4-${time}`);

    await expect(link6)
      .toStrictEqual(`/de/o1-${time}/d1-${time}/d2-${time}/d3-${time}/d4-${time}/d5-${time}`);

    await expect(link7)
      .toStrictEqual(`/de/o1-${time}/d1-${time}/d2-${time}/d3-${time}/d4-${time}/d5-${time}/d6-${time}`);

    await expect(link8)
      .toHaveCount(0);

    // #########################################
    // verify correct url rendering: it
    // #########################################
    await page.goto(`http://localhost:3000/it/o1-it-${time}/d1-it-${time}/d2-it-${time}/d3-it-${time}/d4-it-${time}/d5-it-${time}/d6-it-${time}/d7-it-${time}`);
    await page.waitForLoadState('networkidle');

    const linkHomeIt = await page.getByRole('link', {
      name: 'Home IT',
    })
      .getAttribute('href');

    const link1It = await page.getByRole('link', {
      name: '[test]link:o1-it',
    })
      .getAttribute('href');

    const link2It = await page.getByRole('link', {
      name: '[test]link:d1-it',
    })
      .getAttribute('href');

    const link3It = await page.getByRole('link', {
      name: '[test]link:d2-it',
    })
      .getAttribute('href');

    const link4It = await page.getByRole('link', {
      name: '[test]link:d3-it',
    })
      .getAttribute('href');

    const link5It = await page.getByRole('link', {
      name: '[test]link:d4-it',
    })
      .getAttribute('href');

    const link6It = await page.getByRole('link', {
      name: '[test]link:d5-it',
    })
      .getAttribute('href');

    const link7It = await page.getByRole('link', {
      name: '[test]link:d6-it',
    })
      .getAttribute('href');

    const link8It = await page.getByRole('link', {
      name: '[test]link:d7-it',
    });

    await expect(linkHomeIt)
      .toStrictEqual('/it');

    await expect(link1It)
      .toStrictEqual(`/it/o1-it-${time}`);

    await expect(link2It)
      .toStrictEqual(`/it/o1-it-${time}/d1-it-${time}`);

    await expect(link3It)
      .toStrictEqual(`/it/o1-it-${time}/d1-it-${time}/d2-it-${time}`);

    await expect(link4It)
      .toStrictEqual(`/it/o1-it-${time}/d1-it-${time}/d2-it-${time}/d3-it-${time}`);

    await expect(link5It)
      .toStrictEqual(`/it/o1-it-${time}/d1-it-${time}/d2-it-${time}/d3-it-${time}/d4-it-${time}`);

    await expect(link6It)
      .toStrictEqual(`/it/o1-it-${time}/d1-it-${time}/d2-it-${time}/d3-it-${time}/d4-it-${time}/d5-it-${time}`);

    await expect(link7It)
      .toStrictEqual(`/it/o1-it-${time}/d1-it-${time}/d2-it-${time}/d3-it-${time}/d4-it-${time}/d5-it-${time}/d6-it-${time}`);

    await expect(link8It)
      .toHaveCount(0);

  });
});
