import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';

const defaultMeta = (time: number, lang?: string): any => ({
  meta: {
    seo: {
      description: `description ${time}${lang || ''}`,
      index: false,
      keywords: [
        {
          keyword: `keyword 1 ${time}${lang || ''}`,
        },
        {
          keyword: `keyword 2 ${time}${lang || ''}`,
        },
      ],
      title: `title ${time}${lang || ''}`,
    },
  },
});

test.describe('render meta home', () => {
  beforeEachAcceptCookies();

  test('correctly renders meta (sagw)', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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

    await payload.update({
      collection: 'homePage',
      data: {
        ...defaultMeta(time),
        tenant,
      },
      id: home,
      locale: 'de',
    });

    await page.goto('http://localhost:3000/de/');
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}`);

  });

  test('correctly renders meta italian (sagw)', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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

    await payload.update({
      collection: 'homePage',
      data: {
        ...defaultMeta(time, 'it'),
        hero: {
          optionalLink: {
            link: {
              linkText: simpleRteConfig('foo'),
            },
          },
          sideTitle: simpleRteConfig('sidetitle'),
          title: simpleRteConfig('title'),
        },
        tenant,
      },
      id: home,
      locale: 'it',
    });

    await page.goto('http://localhost:3000/it/');
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}it`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}it`);

  });

  test('correctly renders meta (non-sagw)', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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

    await payload.update({
      collection: 'homePage',
      data: {
        ...defaultMeta(time),
        tenant,
      },
      id: home,
      locale: 'de',
    });

    await page.goto(`http://localhost:3000/de/tenant-${time}`);
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}`);

  });

  test('correctly renders meta italian (non-sagw)', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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

    await payload.update({
      collection: 'homePage',
      data: {
        ...defaultMeta(time, 'it'),
        hero: {
          sideTitle: simpleRteConfig('sidetitle'),
          title: simpleRteConfig('title'),
        },
        tenant,
      },
      id: home,
      locale: 'it',
    });

    await page.goto(`http://localhost:3000/it/tenant-${time}-it`);
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}it`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}it`);

  });
});

test.describe('render meta on other pages', () => {
  beforeEachAcceptCookies();

  test('correctly renders meta (sagw)', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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

    const detail = await generateDetailPage({
      locale: 'de',
      navigationTitle: 'navTitle',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time),
        tenant,
      },
      id: detail.id,
      locale: 'de',
    });

    await page.goto(`http://localhost:3000/de/detail-${time}`);
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}`);

  });

  test('correctly renders meta italian (sagw)', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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

    const detail = await generateDetailPage({
      locale: 'it',
      navigationTitle: 'navTitle',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'it'),
        tenant,
      },
      id: detail.id,
      locale: 'it',
    });

    await page.goto(`http://localhost:3000/it/detail-${time}`);
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}it`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}it`);

  });

  test('correctly renders meta (non-sagw)', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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

    const detail = await generateDetailPage({
      locale: 'de',
      navigationTitle: 'navTitle',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time),
        tenant,
      },
      id: detail.id,
      locale: 'de',
    });

    await page.goto(`http://localhost:3000/de/tenant-${time}/detail-${time}`);
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}`);

  });

  test('correctly renders meta italian (non-sagw)', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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

    const detail = await generateDetailPage({
      locale: 'it',
      navigationTitle: 'navTitle',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'it'),
        tenant,
      },
      id: detail.id,
      locale: 'it',
    });

    await page.goto(`http://localhost:3000/it/tenant-${time}-it/detail-${time}`);
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}it`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}it`);

  });
});
