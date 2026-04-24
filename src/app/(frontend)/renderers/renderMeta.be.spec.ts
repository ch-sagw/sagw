import {
  expect,
  type Page,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import {
  generateTenant, getTenantId,
} from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  deleteOtherCollections, deleteSetsPages, deleteTenants,
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

const openGraphLocale = (locale: string): string => `${locale}_${locale.toUpperCase()}`;

const expectOpenGraphAndTwitter = async (
  page: Page,
  {
    canonicalHref,
    description,
    title,
    pageLocale,
  }: {
    canonicalHref: string;
    description: string;
    pageLocale: string;
    title: string;
  },
): Promise<void> => {
  await expect(page.locator('meta[property="og:title"]'))
    .toHaveAttribute('content', title);
  await expect(page.locator('meta[property="og:description"]'))
    .toHaveAttribute('content', description);
  await expect(page.locator('meta[property="og:url"]'))
    .toHaveAttribute('content', canonicalHref);
  await expect(page.locator('meta[property="og:type"]'))
    .toHaveAttribute('content', 'website');
  await expect(page.locator('meta[property="og:locale"]'))
    .toHaveAttribute('content', openGraphLocale(pageLocale));
  await expect(page.locator('meta[name="twitter:card"]'))
    .toHaveAttribute('content', 'summary');
  await expect(page.locator('meta[name="twitter:title"]'))
    .toHaveAttribute('content', title);
  await expect(page.locator('meta[name="twitter:description"]'))
    .toHaveAttribute('content', description);
};

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

    await expect(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', 'http://localhost:3000/de');
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'))
      .toHaveAttribute('href', 'http://localhost:3000/de');
    await expect(page.locator('link[rel="alternate"][hreflang="de-CH"]'))
      .toHaveAttribute('href', 'http://localhost:3000/de');
    await expect(page.locator('link[rel="alternate"][hreflang="fr-CH"]'))
      .toHaveAttribute('href', 'http://localhost:3000/fr');
    await expect(page.locator('link[rel="alternate"][hreflang="it-CH"]'))
      .toHaveAttribute('href', 'http://localhost:3000/it');
    await expect(page.locator('link[rel="alternate"][hreflang="en-GB"]'))
      .toHaveAttribute('href', 'http://localhost:3000/en');

    await expectOpenGraphAndTwitter(page, {
      canonicalHref: 'http://localhost:3000/de',
      description: `description ${time}`,
      pageLocale: 'de',
      title: `title ${time}`,
    });
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

    await expect(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', 'http://localhost:3000/it');
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'))
      .toHaveAttribute('href', 'http://localhost:3000/de');
    await expect(page.locator('link[rel="alternate"][hreflang="de-CH"]'))
      .toHaveAttribute('href', 'http://localhost:3000/de');
    await expect(page.locator('link[rel="alternate"][hreflang="fr-CH"]'))
      .toHaveAttribute('href', 'http://localhost:3000/fr');
    await expect(page.locator('link[rel="alternate"][hreflang="it-CH"]'))
      .toHaveAttribute('href', 'http://localhost:3000/it');
    await expect(page.locator('link[rel="alternate"][hreflang="en-GB"]'))
      .toHaveAttribute('href', 'http://localhost:3000/en');

    await expectOpenGraphAndTwitter(page, {
      canonicalHref: 'http://localhost:3000/it',
      description: `description ${time}it`,
      pageLocale: 'it',
      title: `title ${time}it`,
    });
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

    await expect(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="de-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="fr-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/fr/tenant-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="it-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/it/tenant-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="en-GB"]'))
      .toHaveAttribute('href', `http://localhost:3000/en/tenant-${time}`);

    await expectOpenGraphAndTwitter(page, {
      canonicalHref: `http://localhost:3000/de/tenant-${time}`,
      description: `description ${time}`,
      pageLocale: 'de',
      title: `title ${time}`,
    });
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

    await page.goto(`http://localhost:3000/it/tenant-${time}`);
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}it`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}it`);

    await expect(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', `http://localhost:3000/it/tenant-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="de-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="fr-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/fr/tenant-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="it-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/it/tenant-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="en-GB"]'))
      .toHaveAttribute('href', `http://localhost:3000/en/tenant-${time}`);

    await expectOpenGraphAndTwitter(page, {
      canonicalHref: `http://localhost:3000/it/tenant-${time}`,
      description: `description ${time}it`,
      pageLocale: 'it',
      title: `title ${time}it`,
    });
  });

  test('only emits alternates for tenant-enabled locales', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();
    await deleteTenants();

    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();

    const tenantDoc = await generateTenant({
      slug: `tenant-${time}`,
    });

    await payload.update({
      collection: 'tenants',
      data: {
        languages: {
          de: true,
          en: false,
          fr: true,
          it: false,
        },
      },
      id: tenantDoc.id,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenantDoc.id,
    });

    await payload.update({
      collection: 'homePage',
      data: {
        ...defaultMeta(time),
        tenant: tenantDoc.id,
      },
      id: home,
      locale: 'de',
    });

    await page.goto(`http://localhost:3000/de/tenant-${time}`);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="de-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="fr-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/fr/tenant-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="it-CH"]'))
      .toHaveCount(0);
    await expect(page.locator('link[rel="alternate"][hreflang="en-GB"]'))
      .toHaveCount(0);

    await expectOpenGraphAndTwitter(page, {
      canonicalHref: `http://localhost:3000/de/tenant-${time}`,
      description: `description ${time}`,
      pageLocale: 'de',
      title: `title ${time}`,
    });
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
      title: `detail-de-${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-de-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'de',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'fr'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-fr-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'fr',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'it'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-it-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'it',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'en'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-en-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'en',
    });

    await page.goto(`http://localhost:3000/de/detail-de-${time}`);
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}`);

    await expect(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/detail-de-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/detail-de-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="de-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/detail-de-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="fr-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/fr/detail-fr-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="it-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/it/detail-it-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="en-GB"]'))
      .toHaveAttribute('href', `http://localhost:3000/en/detail-en-${time}`);

    await expectOpenGraphAndTwitter(page, {
      canonicalHref: `http://localhost:3000/de/detail-de-${time}`,
      description: `description ${time}`,
      pageLocale: 'de',
      title: `title ${time}`,
    });
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
      locale: 'de',
      navigationTitle: 'navTitle',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail-de-${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-de-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'de',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'fr'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-fr-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'fr',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'it'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-it-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'it',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'en'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-en-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'en',
    });

    await page.goto(`http://localhost:3000/it/detail-it-${time}`);
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}it`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}it`);

    await expect(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', `http://localhost:3000/it/detail-it-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/detail-de-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="de-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/detail-de-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="fr-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/fr/detail-fr-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="it-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/it/detail-it-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="en-GB"]'))
      .toHaveAttribute('href', `http://localhost:3000/en/detail-en-${time}`);

    await expectOpenGraphAndTwitter(page, {
      canonicalHref: `http://localhost:3000/it/detail-it-${time}`,
      description: `description ${time}it`,
      pageLocale: 'it',
      title: `title ${time}it`,
    });
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
      title: `detail-de-${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-de-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'de',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'fr'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-fr-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'fr',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'it'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-it-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'it',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'en'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-en-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'en',
    });

    await page.goto(`http://localhost:3000/de/tenant-${time}/detail-de-${time}`);
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}`);

    await expect(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}/detail-de-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}/detail-de-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="de-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}/detail-de-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="fr-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/fr/tenant-${time}/detail-fr-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="it-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/it/tenant-${time}/detail-it-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="en-GB"]'))
      .toHaveAttribute('href', `http://localhost:3000/en/tenant-${time}/detail-en-${time}`);

    await expectOpenGraphAndTwitter(page, {
      canonicalHref: `http://localhost:3000/de/tenant-${time}/detail-de-${time}`,
      description: `description ${time}`,
      pageLocale: 'de',
      title: `title ${time}`,
    });
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
      locale: 'de',
      navigationTitle: 'navTitle',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `detail-de-${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-de-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'de',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'fr'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-fr-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'fr',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'it'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-it-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'it',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time, 'en'),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `detail-en-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'en',
    });

    await page.goto(`http://localhost:3000/it/tenant-${time}/detail-it-${time}`);
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]');

    await expect(metaDescription)
      .toHaveAttribute(
        'content',
        `description ${time}it`,
      );

    await expect(page)
      .toHaveTitle(`title ${time}it`);

    await expect(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', `http://localhost:3000/it/tenant-${time}/detail-it-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}/detail-de-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="de-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/de/tenant-${time}/detail-de-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="fr-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/fr/tenant-${time}/detail-fr-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="it-CH"]'))
      .toHaveAttribute('href', `http://localhost:3000/it/tenant-${time}/detail-it-${time}`);
    await expect(page.locator('link[rel="alternate"][hreflang="en-GB"]'))
      .toHaveAttribute('href', `http://localhost:3000/en/tenant-${time}/detail-en-${time}`);

    await expectOpenGraphAndTwitter(page, {
      canonicalHref: `http://localhost:3000/it/tenant-${time}/detail-it-${time}`,
      description: `description ${time}it`,
      pageLocale: 'it',
      title: `title ${time}it`,
    });
  });

  test('omits hreflang when that locale has no translated page', async ({
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
      title: `mono-de-${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        ...defaultMeta(time),
        hero: detail.hero,
        navigationTitle: detail.navigationTitle,
        slug: `mono-de-${time}`,
        tenant,
      },
      id: detail.id,
      locale: 'de',
    });

    const href = `http://localhost:3000/de/mono-de-${time}`;

    await page.goto(href);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', href);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'))
      .toHaveAttribute('href', href);
    await expect(page.locator('link[rel="alternate"][hreflang="de-CH"]'))
      .toHaveAttribute('href', href);
    await expect(page.locator('link[rel="alternate"][hreflang="fr-CH"]'))
      .toHaveCount(0);
    await expect(page.locator('link[rel="alternate"][hreflang="it-CH"]'))
      .toHaveCount(0);
    await expect(page.locator('link[rel="alternate"][hreflang="en-GB"]'))
      .toHaveCount(0);
  });
});
