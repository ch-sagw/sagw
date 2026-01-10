// make sure correct data is rendered for a spcific url (tenant & locale)

import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import {
  generateTenant, getTenant,
} from '@/test-helpers/tenant-generator';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  generateConsentData,
  generateDataPrivacyPage,
  generateDetailPage, generateFooterData, generateHomePage, generateI18nData, generateImpressumPage, generateOverviewPage,
} from '@/test-helpers/collections-generator';

test.describe('Data rendering (sagw)', () => {
  beforeEachAcceptCookies();
  test('fetches correct content', async ({
    page,
  }) => {
    const payload = await getPayloadCached();
    const sagwTenant = await getTenant();
    const time = (new Date())
      .getTime();
    const nonSagwTenant = await generateTenant({
      name: `tenant-${time}`,
    });

    try {
      const home = await payload.find({
        collection: 'homePage',
        where: {
          tenant: {
            equals: sagwTenant,
          },
        },
      });

      const homeNonSagw = await generateHomePage({
        sideTitle: 'Side',
        tenant: nonSagwTenant.id,
        title: 'Home',
      });

      // #########################################
      // add remainig home data
      // #########################################
      await generateFooterData({
        tenant: nonSagwTenant.id,
      });

      await generateI18nData({
        tenant: nonSagwTenant.id,
      });

      await generateConsentData({
        tenant: nonSagwTenant.id,
      });

      await generateImpressumPage({
        tenant: nonSagwTenant.id,
      });

      await generateDataPrivacyPage({
        tenant: nonSagwTenant.id,
      });

      // #########################################
      // generate sagw pages
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

      // #########################################
      // generate non-sagw pages
      // #########################################
      const o1NonSagw = await generateOverviewPage({
        navigationTitle: '[test]link:o1',
        parentPage: {
          documentId: homeNonSagw.id,
          slug: 'homePage',
        },
        tenant: nonSagwTenant.id,
        title: `o1 ${time} tenant-${time}`,
      });

      await payload.update({
        collection: 'overviewPage',
        data: {
          hero: {
            title: simpleRteConfig(`o1 it ${time} tenant-${time}`),
          },
          navigationTitle: '[test]link:o1-it',
        },
        id: o1NonSagw.id,
        locale: 'it',
      });

      const d1NonSagw = await generateDetailPage({
        navigationTitle: '[test]link:d1',
        parentPage: {
          documentId: o1NonSagw.id,
          slug: 'overviewPage',
        },
        tenant: nonSagwTenant.id,
        title: `d1 ${time} tenant-${time}`,
      });

      await payload.update({
        collection: 'detailPage',
        data: {
          hero: {
            title: simpleRteConfig(`d1 it ${time} tenant-${time}`),
          },
          navigationTitle: '[test]link:d1-it',
        },
        id: d1NonSagw.id,
        locale: 'it',
      });
    } catch (e) {
      throw new Error(e instanceof Error
        ? e.message
        : String(e));
    }

    // #########################################
    // check sagw pages
    // #########################################
    await page.goto(`http://localhost:3000/de/o1-${time}`);
    await page.waitForLoadState('networkidle');
    const overviewHero = await page.getByRole('heading', {
      level: 1,
    })
      .textContent();

    await expect(overviewHero)
      .toStrictEqual(`o1 ${time}`);

    await page.goto(`http://localhost:3000/de/o1-${time}/d1-${time}`);
    await page.waitForLoadState('networkidle');
    const detailHero = await page.getByRole('heading', {
      level: 1,
    })
      .textContent();

    await expect(detailHero)
      .toStrictEqual(`d1 ${time}`);

    await page.goto(`http://localhost:3000/it/o1-it-${time}`);
    await page.waitForLoadState('networkidle');
    const overviewHeroIt = await page.getByRole('heading', {
      level: 1,
    })
      .textContent();

    await expect(overviewHeroIt)
      .toStrictEqual(`o1 it ${time}`);

    await page.goto(`http://localhost:3000/it/o1-it-${time}/d1-it-${time}`);
    await page.waitForLoadState('networkidle');
    const detailHeroIt = await page.getByRole('heading', {
      level: 1,
    })
      .textContent();

    await expect(detailHeroIt)
      .toStrictEqual(`d1 it ${time}`);

    // #########################################
    // check non-sagw pages
    // #########################################

    await page.goto(`http://localhost:3000/de/tenant-${time}/o1-${time}-tenant-${time}`);
    await page.waitForLoadState('networkidle');
    const overviewHeroNonSagw = await page.getByRole('heading', {
      level: 1,
    })
      .textContent();

    await expect(overviewHeroNonSagw)
      .toStrictEqual(`o1 ${time} tenant-${time}`);

    await page.goto(`http://localhost:3000/de/tenant-${time}/o1-${time}-tenant-${time}/d1-${time}-tenant-${time}`);
    await page.waitForLoadState('networkidle');
    const detailHeroNonSagw = await page.getByRole('heading', {
      level: 1,
    })
      .textContent();

    await expect(detailHeroNonSagw)
      .toStrictEqual(`d1 ${time} tenant-${time}`);

    await page.goto(`http://localhost:3000/it/tenant-${time}-it/o1-it-${time}-tenant-${time}`);
    await page.waitForLoadState('networkidle');
    const overviewHeroItNonSagw = await page.getByRole('heading', {
      level: 1,
    })
      .textContent();

    await expect(overviewHeroItNonSagw)
      .toStrictEqual(`o1 it ${time} tenant-${time}`);

    await page.goto(`http://localhost:3000/it/tenant-${time}-it/o1-it-${time}-tenant-${time}/d1-it-${time}-tenant-${time}`);
    await page.waitForLoadState('networkidle');
    const detailHeroItNonSagw = await page.getByRole('heading', {
      level: 1,
    })
      .textContent();

    await expect(detailHeroItNonSagw)
      .toStrictEqual(`d1 it ${time} tenant-${time}`);
  });
});
