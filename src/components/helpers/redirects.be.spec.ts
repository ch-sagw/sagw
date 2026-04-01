import {
  expect,
  test,
} from '@playwright/test';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import {
  generateTenant,
  getTenant,
} from '@/test-helpers/tenant-generator';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';
import {
  generateCollectionsExceptPages, generateConsentData, generateDataPrivacyPage, generateDetailPage, generateFooterData, generateHomePage, generateI18nData, generateImpressumPage, generateOverviewPage,
} from '@/test-helpers/collections-generator';

test.describe('Redirects', () => {
  beforeEachAcceptCookies();

  test('properly redirects', {
    tag: '@redirects',
  }, async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();
    const payload = await getPayloadCached();
    const tenant = await getTenant();
    const time = (new Date())
      .getTime();

    await generateCollectionsExceptPages({
      tenant: tenant || '',
    });

    const home = await payload.find({
      collection: 'homePage',
      where: {
        tenant: {
          equals: tenant,
        },
      },
    });

    const overviewB = await generateOverviewPage({
      locale: 'de',
      parentPage: {
        documentId: home.docs[0].id,
        slug: 'homePage',
      },
      tenant: tenant || '',
      title: `overview-b-${time}`,
    });

    await generateDetailPage({
      locale: 'de',
      parentPage: {
        documentId: overviewB.id,
        slug: 'overviewPage',
      },
      tenant: tenant || '',
      title: `detail-b-${time}`,
    });

    // redirect detailA to detailB
    await payload.create({
      collection: 'redirects',
      data: {
        from: `de/overview-a-${time}/detail-a-${time}`,
        tenant: tenant || '',
        to: `de/overview-b-${time}/detail-b-${time}`,
      },
    });

    // visit detailA
    const redirectTargetPath = `overview-b-${time}/detail-b-${time}`;
    const urlPageA = `http://localhost:3000/de/overview-a-${time}/detail-a-${time}`;
    const urlPageB = `http://localhost:3000/de/${redirectTargetPath}`;

    // first 307 may be middleware (e.g. trailing slash)
    // with Location still on page A; the CMS redirect is the document 307
    // whose Location points at page B.
    const redirectResponsePromise = page.waitForResponse((response) => {
      if (response.request()
        .resourceType() !== 'document') {
        return false;
      }
      if (response.status() !== 307) {
        return false;
      }
      const location = response.headers().location ?? '';

      return location.includes(redirectTargetPath);
    });

    // expect 307 response code and correct target page
    await page.goto(urlPageA);
    const redirectResponse = await redirectResponsePromise;

    await expect(redirectResponse.status())
      .toBe(307);
    await expect(redirectResponse.headers().location)
      .toContain(redirectTargetPath);

    // expect target page to be loaded
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveURL(urlPageB);

  });

  test('properly redirects multiple levels', {
    tag: '@redirects',
  }, async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();
    const payload = await getPayloadCached();
    const tenant = await getTenant();
    const time = (new Date())
      .getTime();

    await generateCollectionsExceptPages({
      tenant: tenant || '',
    });

    const home = await payload.find({
      collection: 'homePage',
      where: {
        tenant: {
          equals: tenant,
        },
      },
    });

    const overviewB = await generateOverviewPage({
      locale: 'de',
      parentPage: {
        documentId: home.docs[0].id,
        slug: 'homePage',
      },
      tenant: tenant || '',
      title: `overview-b-${time}`,
    });

    await generateDetailPage({
      locale: 'de',
      parentPage: {
        documentId: overviewB.id,
        slug: 'overviewPage',
      },
      tenant: tenant || '',
      title: `detail-b-${time}`,
    });

    const url1 = `de/overview-pseudo1-${time}/detail-pseudo1-${time}`;
    const url2 = `de/overview-pseudo1-b-${time}/detail-pseudo1-b-${time}`;
    const url3 = `de/overview-a-${time}/detail-a-${time}`;
    const url4 = `de/overview-b-${time}/detail-b-${time}`;

    // pseudo redirect 1
    await payload.create({
      collection: 'redirects',
      data: {
        from: url1,
        tenant: tenant || '',
        to: url2,
      },
    });

    // pseudo redirect 1
    await payload.create({
      collection: 'redirects',
      data: {
        from: url2,
        tenant: tenant || '',
        to: url3,
      },
    });

    // redirect detailA to detailB
    await payload.create({
      collection: 'redirects',
      data: {
        from: url3,
        tenant: tenant || '',
        to: url4,
      },
    });

    // visit detailA
    const urlPageA = `http://localhost:3000/de/${url1}`;
    const urlPageB = `http://localhost:3000/de/${url4}`;

    // first 307 may be middleware (e.g. trailing slash)
    // with Location still on page A; the CMS redirect is the document 307
    // whose Location points at page B.
    const redirectResponsePromise = page.waitForResponse((response) => {
      if (response.request()
        .resourceType() !== 'document') {
        return false;
      }
      if (response.status() !== 307) {
        return false;
      }
      const location = response.headers().location ?? '';

      return location.includes(url4);
    });

    // expect 307 response code and correct target page
    await page.goto(urlPageA);
    const redirectResponse = await redirectResponsePromise;

    await expect(redirectResponse.status())
      .toBe(307);
    await expect(redirectResponse.headers().location)
      .toContain(url4);

    // expect target page to be loaded
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveURL(urlPageB);

  });

  test('properly redirects in italian', {
    tag: '@redirects',
  }, async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();
    const payload = await getPayloadCached();
    const tenant = await getTenant();
    const time = (new Date())
      .getTime();

    await generateCollectionsExceptPages({
      tenant: tenant || '',
    });

    const home = await payload.find({
      collection: 'homePage',
      where: {
        tenant: {
          equals: tenant,
        },
      },
    });

    const overviewA = await generateOverviewPage({
      locale: 'it',
      parentPage: {
        documentId: home.docs[0].id,
        slug: 'homePage',
      },
      tenant: tenant || '',
      title: `overview-a-${time}`,
    });

    const overviewB = await generateOverviewPage({
      locale: 'it',
      parentPage: {
        documentId: home.docs[0].id,
        slug: 'homePage',
      },
      tenant: tenant || '',
      title: `overview-b-${time}`,
    });

    await generateDetailPage({
      locale: 'it',
      parentPage: {
        documentId: overviewA.id,
        slug: 'overviewPage',
      },
      tenant: tenant || '',
      title: `detail-a-${time}`,
    });

    await generateDetailPage({
      locale: 'it',
      parentPage: {
        documentId: overviewB.id,
        slug: 'overviewPage',
      },
      tenant: tenant || '',
      title: `detail-b-${time}`,
    });

    // redirect detailA to detailB
    await payload.create({
      collection: 'redirects',
      data: {
        from: `it/overview-a-${time}/detail-a-${time}`,
        tenant: tenant || '',
        to: `it/overview-b-${time}/detail-b-${time}`,
      },
    });

    // visit detailA
    const redirectTargetPath = `overview-b-${time}/detail-b-${time}`;
    const urlPageA = `http://localhost:3000/it/overview-a-${time}/detail-a-${time}`;
    const urlPageB = `http://localhost:3000/it/${redirectTargetPath}`;

    // first 307 may be middleware (e.g. trailing slash)
    // with Location still on page A; the CMS redirect is the document 307
    // whose Location points at page B.
    const redirectResponsePromise = page.waitForResponse((response) => {
      if (response.request()
        .resourceType() !== 'document') {
        return false;
      }
      if (response.status() !== 307) {
        return false;
      }
      const location = response.headers().location ?? '';

      return location.includes(redirectTargetPath);
    });

    // expect 307 response code and correct target page
    await page.goto(urlPageA);
    const redirectResponse = await redirectResponsePromise;

    await expect(redirectResponse.status())
      .toBe(307);
    await expect(redirectResponse.headers().location)
      .toContain(redirectTargetPath);

    // expect target page to be loaded
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveURL(urlPageB);

  });

  test('properly redirects (non-sagw)', {
    tag: '@redirects',
  }, async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();
    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();
    const tenant = await generateTenant({
      name: `tenant-${time}`,
    });
    const home = await generateHomePage({
      sideTitle: 'Side',
      tenant: tenant.id,
      title: 'Home',
    });

    await generateCollectionsExceptPages({
      tenant: tenant.id,
    });

    // #########################################
    // add remainig data
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

    const overviewA = await generateOverviewPage({
      locale: 'de',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `overview-a-${time}`,
    });

    const overviewB = await generateOverviewPage({
      locale: 'de',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `overview-b-${time}`,
    });

    await generateDetailPage({
      locale: 'de',
      parentPage: {
        documentId: overviewA.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `detail-a-${time}`,
    });

    await generateDetailPage({
      locale: 'de',
      parentPage: {
        documentId: overviewB.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `detail-b-${time}`,
    });

    // redirect detailA to detailB
    await payload.create({
      collection: 'redirects',
      data: {
        from: `de/tenant-${time}/overview-a-${time}/detail-a-${time}`,
        tenant: tenant.id,
        to: `de/tenant-${time}/overview-b-${time}/detail-b-${time}`,
      },
    });

    // visit detailA
    const redirectTargetPath = `overview-b-${time}/detail-b-${time}`;
    const urlPageA = `http://localhost:3000/de/tenant-${time}/overview-a-${time}/detail-a-${time}`;
    const urlPageB = `http://localhost:3000/de/tenant-${time}/${redirectTargetPath}`;

    // first 307 may be middleware (e.g. trailing slash)
    // with Location still on page A; the CMS redirect is the document 307
    // whose Location points at page B.
    const redirectResponsePromise = page.waitForResponse((response) => {
      if (response.request()
        .resourceType() !== 'document') {
        return false;
      }
      if (response.status() !== 307) {
        return false;
      }
      const location = response.headers().location ?? '';

      return location.includes(redirectTargetPath);
    });

    // expect 307 response code and correct target page
    await page.goto(urlPageA);
    const redirectResponse = await redirectResponsePromise;

    await expect(redirectResponse.status())
      .toBe(307);
    await expect(redirectResponse.headers().location)
      .toContain(redirectTargetPath);

    // expect target page to be loaded
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');

    await expect(page)
      .toHaveURL(urlPageB);

  });

});
