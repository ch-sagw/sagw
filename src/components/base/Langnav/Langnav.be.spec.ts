import {
  expect,
  test,
} from '@playwright/test';
import {
  generateMagazineDetailPage,
  generateOverviewPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';

test.describe('langnav', () => {
  beforeEachAcceptCookies();

  test('generates proper langnav links (sagw)', {
    tag: '@cache',
  }, async ({
    page,
  }) => {
    await deleteSetsPages();

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

    const overviewPage = await generateOverviewPage({
      navigationTitle: `overview ${time}`,
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      title: `overview ${time}`,
    });

    const detailPage = await generateMagazineDetailPage({
      navigationTitle: `magazine detail ${time}`,
      parentPage: {
        documentId: overviewPage.id,
        slug: 'overviewPage',
      },
      title: `magazine detail ${time}`,
    });

    // update in other locale

    await payload.update({
      collection: 'overviewPage',
      data: {
        hero: {
          title: simpleRteConfig(`overview it ${time}`),
        },
        navigationTitle: `overview it ${time}`,
        slug: `overview-it-${time}`,
      },
      id: overviewPage.id,
      locale: 'it',
    });

    await payload.update({
      collection: 'magazineDetailPage',
      data: {
        hero: {
          author: simpleRteConfig('some author'),
          title: simpleRteConfig(`magazine detail it ${time}`),
        },
        navigationTitle: `magazine detail it ${time}`,
        overviewPageProps: {
          teaserText: simpleRteConfig('some teaser text'),
        },
        slug: `magazine-detail-it-${time}`,
      },
      id: detailPage.id,
      locale: 'it',
    });

    // go to detail page and verify

    await page.goto(`http://localhost:3000/de/overview-${time}/magazine-detail-${time}`);
    await page.waitForLoadState('networkidle');

    const langnav = await page.getByTestId('langnav');

    const deListItem = await langnav.getByTestId('de');
    const deLinkItem = await deListItem.getByRole('link');
    const deLink = await deLinkItem.getAttribute('href');

    const itListItem = await langnav.getByTestId('it');
    const itLinkItem = await itListItem.getByRole('link');
    const itLink = await itLinkItem.getAttribute('href');

    await expect(deLink)
      .toStrictEqual(`/de/overview-${time}/magazine-detail-${time}`);
    await expect(itLink)
      .toStrictEqual(`/it/overview-it-${time}/magazine-detail-it-${time}`);
  });

  test('generates proper langnav links (non-sagw)', {
    tag: '@cache',
  }, async ({
    page,
  }) => {
    await deleteSetsPages();

    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();

    const tenant = await getTenantId({
      isSagw: false,
      time,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant,
    });

    const overviewPage = await generateOverviewPage({
      navigationTitle: `overview ${time}`,
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${time}`,
    });

    const detailPage = await generateMagazineDetailPage({
      navigationTitle: `magazine detail ${time}`,
      parentPage: {
        documentId: overviewPage.id,
        slug: 'overviewPage',
      },
      tenant,
      title: `magazine detail ${time}`,
    });

    // update in other locale

    await payload.update({
      collection: 'overviewPage',
      data: {
        hero: {
          title: simpleRteConfig(`overview it ${time}`),
        },
        navigationTitle: `overview it ${time}`,
        slug: `overview-it-${time}`,
      },
      id: overviewPage.id,
      locale: 'it',
    });

    await payload.update({
      collection: 'magazineDetailPage',
      data: {
        hero: {
          author: simpleRteConfig('some author'),
          title: simpleRteConfig(`magazine detail it ${time}`),
        },
        navigationTitle: `magazine detail it ${time}`,
        overviewPageProps: {
          teaserText: simpleRteConfig('some teaser text'),
        },
        slug: `magazine-detail-it-${time}`,
      },
      id: detailPage.id,
      locale: 'it',
    });

    // go to detail page and verify

    await page.goto(`http://localhost:3000/de/tenant-${time}/overview-${time}/magazine-detail-${time}`);
    await page.waitForLoadState('networkidle');

    const langnav = await page.getByTestId('langnav');

    const deListItem = await langnav.getByTestId('de');
    const deLinkItem = await deListItem.getByRole('link');
    const deLink = await deLinkItem.getAttribute('href');

    const itListItem = await langnav.getByTestId('it');
    const itLinkItem = await itListItem.getByRole('link');
    const itLink = await itLinkItem.getAttribute('href');

    await expect(deLink)
      .toStrictEqual(`/de/tenant-${time}/overview-${time}/magazine-detail-${time}`);
    await expect(itLink)
      .toStrictEqual(`/it/tenant-${time}-it/overview-it-${time}/magazine-detail-it-${time}`);
  });
});
