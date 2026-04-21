import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDataPrivacyPageInAllLocales,
  generateDetailPageInAllLocales,
  generateEventDetailPageInAllLocales,
  generateHomePageInAllLocales,
  generateImpressumPageInAllLocales,
  generateNewsDetailPageInAllLocales,
  generateOverviewPage,
  generateOverviewPageInAllLocales,
} from '@/test-helpers/collections-generator';
import {
  generateTenant, getTenantId,
} from '@/test-helpers/tenant-generator';
import {
  deleteOtherCollections, deleteSetsPages,
  deleteSingletonPages,
  deleteTenants,
} from '@/seed/test-data/deleteData';
import {
  DataPrivacyPage, DetailPage, EventDetailPage, HomePage, ImpressumPage, NewsDetailPage, OverviewPage,
} from '@/payload-types';
import { getPayloadCached } from '@/utilities/getPayloadCached';

const generatePages = async ({
  tenant,
}: {
  tenant: string;
}): Promise<{
  home: HomePage;
  detail: DetailPage;
  overview: OverviewPage;
  events: EventDetailPage;
  news: NewsDetailPage;
  impressum: ImpressumPage;
  dataPrivacy: DataPrivacyPage;

}> => {
  const home = await generateHomePageInAllLocales({
    tenant,
  });

  const overview = await generateOverviewPageInAllLocales({
    parentCollection: 'homePage',
    parentId: home.id,
    tenant,
    title: 'overview',
  });

  const detail = await generateDetailPageInAllLocales({
    parentCollection: 'overviewPage',
    parentId: overview.id,
    tenant,
    title: 'detail',
  });

  const events = await generateEventDetailPageInAllLocales({
    parentCollection: 'overviewPage',
    parentId: overview.id,
    tenant,
    title: 'event',
  });

  const news = await generateNewsDetailPageInAllLocales({
    parentCollection: 'overviewPage',
    parentId: overview.id,
    tenant,
    title: 'news',
  });

  const impressum = await generateImpressumPageInAllLocales({
    tenant,
  });

  const dataPrivacy = await generateDataPrivacyPageInAllLocales({
    tenant,
  });

  return {
    dataPrivacy,
    detail,
    events,
    home,
    impressum,
    news,
    overview,
  };

};

const langs = [
  'de',
  'fr',
  'it',
  'en',
];

const urlEntryForPage = ({
  time,
  lastmod,
  sagw,
  paths,
}: {
  time: number;
  lastmod: string;
  sagw: boolean;
  paths?: string[];
}): string => {
  const alternateLinks = langs
    .map((lang) => {
      const tenantPath = sagw
        ? ''
        : `/tenant-${time}`;

      const pathAppendix = paths
        ? paths.map((pathItem) => `/${pathItem}-${lang}`)
          .join('')
        : '';

      return `<xhtml:link rel="alternate" hreflang="${lang}" href="https://www.sagw.ch/${lang}${tenantPath}${pathAppendix}" />`;
    })
    .join('\n');

  const entries = langs
    .map((lang2) => {
      const tenantPath = sagw
        ? ''
        : `/tenant-${time}`;

      const pathAppendix = paths
        ? paths.map((pathItem) => `/${pathItem}-${lang2}`)
          .join('')
        : '';

      const entry = `<url>
<loc>https://www.sagw.ch/${lang2}${tenantPath}${pathAppendix}</loc>
${alternateLinks}
<lastmod>${lastmod}</lastmod>
</url>`;

      return entry;
    })
    .join('\n');

  return entries;
};

test('generates sitemap for all pages', async ({
  page,
}) => {
  await deleteSetsPages();
  await deleteOtherCollections();
  await deleteSingletonPages();
  await deleteTenants();

  const time = (new Date())
    .getTime();

  const tenant = await getTenantId({
    isSagw: true,
    time,
  });

  const tenantNonSagw = await generateTenant({
    addDefaultTenantData: false,
    slug: `tenant-${time}`,
  });

  // generate sagw pages
  const sagwPages = await generatePages({
    tenant,
  });

  // generate non-sagw pages
  const nonSagwPages = await generatePages({
    tenant: tenantNonSagw.id,
  });

  const response = await page.request.get('http://localhost:3000/sitemap.xml');

  expect(response.ok())
    .toBeTruthy();

  const xml = await response.text();
  const lineCount = xml.split(/\r?\n/u).length;

  await expect(lineCount)
    .toBe(452);

  const homeSagw = urlEntryForPage({
    lastmod: sagwPages.home.updatedAt,
    sagw: true,
    time,
  });

  const homeNonSagw = urlEntryForPage({
    lastmod: nonSagwPages.home.updatedAt,
    sagw: false,
    time,
  });

  const overviewSagw = urlEntryForPage({
    lastmod: sagwPages.overview.updatedAt,
    paths: ['overview'],
    sagw: true,
    time,
  });

  const overviewNonSagw = urlEntryForPage({
    lastmod: nonSagwPages.overview.updatedAt,
    paths: ['overview'],
    sagw: false,
    time,
  });

  const detailSagw = urlEntryForPage({
    lastmod: sagwPages.detail.updatedAt,
    paths: [
      'overview',
      'detail',
    ],
    sagw: true,
    time,
  });

  const detailNonSagw = urlEntryForPage({
    lastmod: nonSagwPages.detail.updatedAt,
    paths: [
      'overview',
      'detail',
    ],
    sagw: false,
    time,
  });

  const eventSagw = urlEntryForPage({
    lastmod: sagwPages.events.updatedAt,
    paths: [
      'overview',
      'event',
    ],
    sagw: true,
    time,
  });

  const eventNonSagw = urlEntryForPage({
    lastmod: nonSagwPages.events.updatedAt,
    paths: [
      'overview',
      'event',
    ],
    sagw: false,
    time,
  });

  const newsSagw = urlEntryForPage({
    lastmod: sagwPages.news.updatedAt,
    paths: [
      'overview',
      'news',
    ],
    sagw: true,
    time,
  });

  const newsNoneSagw = urlEntryForPage({
    lastmod: nonSagwPages.news.updatedAt,
    paths: [
      'overview',
      'news',
    ],
    sagw: false,
    time,
  });

  const impressumSagw = urlEntryForPage({
    lastmod: sagwPages.impressum.updatedAt,
    paths: ['impressum'],
    sagw: true,
    time,
  });

  const impressumNonSagw = urlEntryForPage({
    lastmod: nonSagwPages.impressum.updatedAt,
    paths: ['impressum'],
    sagw: false,
    time,
  });

  const dataPrivacySagw = urlEntryForPage({
    lastmod: sagwPages.dataPrivacy.updatedAt,
    paths: ['data-privacy'],
    sagw: true,
    time,
  });

  const dataPrivacyNonSagw = urlEntryForPage({
    lastmod: nonSagwPages.dataPrivacy.updatedAt,
    paths: ['data-privacy'],
    sagw: false,
    time,
  });

  await expect(xml.indexOf(homeSagw)).not.toBe(-1);
  await expect(xml.indexOf(homeNonSagw)).not.toBe(-1);
  await expect(xml.indexOf(overviewSagw)).not.toBe(-1);
  await expect(xml.indexOf(overviewNonSagw)).not.toBe(-1);
  await expect(xml.indexOf(detailSagw)).not.toBe(-1);
  await expect(xml.indexOf(detailNonSagw)).not.toBe(-1);
  await expect(xml.indexOf(eventSagw)).not.toBe(-1);
  await expect(xml.indexOf(eventNonSagw)).not.toBe(-1);
  await expect(xml.indexOf(newsSagw)).not.toBe(-1);
  await expect(xml.indexOf(newsNoneSagw)).not.toBe(-1);
  await expect(xml.indexOf(impressumSagw)).not.toBe(-1);
  await expect(xml.indexOf(impressumNonSagw)).not.toBe(-1);
  await expect(xml.indexOf(dataPrivacySagw)).not.toBe(-1);
  await expect(xml.indexOf(dataPrivacyNonSagw)).not.toBe(-1);
});

test('does not include drafts', async ({
  page,
}) => {
  await deleteSetsPages();
  await deleteOtherCollections();
  await deleteSingletonPages();
  await deleteTenants();

  const time = (new Date())
    .getTime();

  const tenant = await getTenantId({
    isSagw: true,
    time,
  });

  const home = await generateHomePageInAllLocales({
    tenant,
  });

  await generateOverviewPage({
    draft: true,
    parentPage: {
      documentId: home.id,
      slug: 'homePage',
    },
    tenant,
    title: 'overview de',
  });

  const response = await page.request.get('http://localhost:3000/sitemap.xml');
  const xml = await response.text();

  await expect(xml.indexOf('overview'))
    .toBe(-1);
});

test('does not include pages with noindex', async ({
  page,
}) => {
  await deleteSetsPages();
  await deleteOtherCollections();
  await deleteSingletonPages();
  await deleteTenants();

  const payload = await getPayloadCached();
  const time = (new Date())
    .getTime();

  const tenant = await getTenantId({
    isSagw: true,
    time,
  });

  const home = await generateHomePageInAllLocales({
    tenant,
  });

  const overview = await generateOverviewPage({
    parentPage: {
      documentId: home.id,
      slug: 'homePage',
    },
    tenant,
    title: 'overview de',
  });

  await payload.update({
    collection: 'overviewPage',
    data: {
      meta: {
        seo: {
          index: false,
        },
      },
    },
    id: overview.id,
  });

  const response = await page.request.get('http://localhost:3000/sitemap.xml');
  const xml = await response.text();

  await expect(xml.indexOf('overview'))
    .toBe(-1);
});
