// make sure correct data is rendered for a spcific url (tenant & locale)

import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  generateDocument,
  generateEventDetailPage,
  generateMagazineDetailPage,
  generateNewsDetailPage,
  generateProjectDetailPage,
  generatePublicationDetailPage,
  generateZenodoDocument,
  getHomeId,
} from '@/test-helpers/collections-generator';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { seoData } from '@/seed/test-data/seoData';

test.describe('Teaser rendering project detail page (sagw)', () => {
  beforeEachAcceptCookies();
  test('only shows related teasers', async ({
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig(`Project ${time}`),
        tenant,
      },
      locale: 'de',
    });

    // #########################################
    // Generate pages & document to show in teasers
    // #########################################

    // unrelatedEventPage
    await generateEventDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `unrelated event ${time}`,
    });

    // relatedEventPage
    await generateEventDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `related event ${time}`,
    });

    // unrelatedNewsPage
    await generateNewsDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `unrelated news ${time}`,
    });

    // relatedNewsPage
    await generateNewsDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `related news ${time}`,
    });

    // unrelatedPublicationPage
    await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `unrelated publication ${time}`,
    });

    // relatedPublicationPage
    await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `related publication ${time}`,
    });

    // unrelated document
    await generateDocument(tenant, undefined, 'unrelated document');

    // related document
    await generateDocument(tenant, project.id, 'related document');

    // unrelated zenodo document
    await generateZenodoDocument(tenant, undefined, 'unrelated zenodo document');

    // related zenodo document
    await generateZenodoDocument(tenant, project.id, 'related zenodo document');

    // #########################################
    // Generate project detail page
    // #########################################
    await payload.create({
      collection: 'projectDetailPage',
      data: {
        /* eslint-disable @typescript-eslint/naming-convention */
        _status: 'published',
        /* eslint-enable @typescript-eslint/naming-convention */
        content: [
          {
            blockType: 'eventsTeasersBlock',
            title: simpleRteConfig('Events'),
          },
          {
            blockType: 'newsTeasersBlock',
            colorMode: 'light',
            title: simpleRteConfig('News'),
          },
          {
            blockType: 'publicationsTeasersBlock',
            title: simpleRteConfig('Publication Teaser'),
          },
          {
            blockType: 'downloadsBlock',
            customOrAuto: 'auto',
            project,
          },
        ],
        hero: {
          colorMode: 'light',
          title: simpleRteConfig(`Project ${time}`),
        },
        ...seoData,
        navigationTitle: 'Project',
        overviewPageProps: {
          linkText: simpleRteConfig('some text'),
          teaserText: simpleRteConfig('some text'),
        },
        parentPage: {
          documentId: home,
          slug: 'homePage',
        },
        project,
        slug: `project-${time}`,
        tenant,
      },
      draft: false,
      locale: 'de',
    });

    await page.goto(`http://localhost:3000/de/project-${time}`);
    await page.waitForLoadState('networkidle');

    const eventsList = await page.locator(':text("Events") + [data-testid="teaser-linklist"]');
    const events = eventsList.getByRole('listitem');

    const newsList = await page.locator(':text("News") + [data-testid="teaser-linklist"]');
    const news = newsList.getByRole('listitem');

    const publicationTeaserList = await page.locator(':text("Publication Teaser") + [data-testid="teaser-linklist"]');
    const publicationTeasers = publicationTeaserList.getByRole('listitem');

    const downloadsList = await page.locator(':text("Download title") + [data-testid="teaser-linklist"]');
    const downloads = downloadsList.getByRole('listitem');

    await expect(events)
      .toHaveCount(1);
    await expect(news)
      .toHaveCount(1);
    await expect(publicationTeasers)
      .toHaveCount(1);
    await expect(downloads)
      .toHaveCount(3);

  });

  test('shows all related teasers', async ({
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

    const project = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig(`Project ${time}`),
        tenant,
      },
      locale: 'de',
    });

    // #########################################
    // Generate pages & document to show in teasers
    // #########################################

    // events

    await generateEventDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `related event 1 ${time}`,
    });

    await generateEventDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `related event 2 ${time}`,
    });

    await generateEventDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `related event 3 ${time}`,
    });

    await generateEventDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `related event 4 ${time}`,
    });

    await generateEventDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `related event 5 ${time}`,
    });

    // news

    await generateNewsDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `related news 1 ${time}`,
    });

    await generateNewsDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `related news 2 ${time}`,
    });

    await generateNewsDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `related news 3 ${time}`,
    });

    await generateNewsDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `related news 4 ${time}`,
    });

    await generateNewsDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `related news 5 ${time}`,
    });

    // publications page

    await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `related publication 1 ${time}`,
    });

    await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `related publication 2 ${time}`,
    });

    await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `related publication 3 ${time}`,
    });

    await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `related publication 4 ${time}`,
    });

    await generatePublicationDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      project: project.id,
      tenant,
      title: `related publication 5 ${time}`,
    });

    // document
    await generateDocument(tenant, project.id, 'related document 1');
    await generateDocument(tenant, project.id, 'related document 2');
    await generateDocument(tenant, project.id, 'related document 3');
    await generateDocument(tenant, project.id, 'related document 4');
    await generateDocument(tenant, project.id, 'related document 5');

    // zenodo documents
    await generateZenodoDocument(tenant, project.id, 'related zenodo document 1');
    await generateZenodoDocument(tenant, project.id, 'related zenodo document 2');
    await generateZenodoDocument(tenant, project.id, 'related zenodo document 3');
    await generateZenodoDocument(tenant, project.id, 'related zenodo document 4');
    await generateZenodoDocument(tenant, project.id, 'related zenodo document 5');

    // #########################################
    // Generate project detail page
    // #########################################
    await payload.create({
      collection: 'projectDetailPage',
      data: {
        /* eslint-disable @typescript-eslint/naming-convention */
        _status: 'published',
        /* eslint-enable @typescript-eslint/naming-convention */
        content: [
          {
            blockType: 'eventsTeasersBlock',
            title: simpleRteConfig('Events'),
          },
          {
            blockType: 'newsTeasersBlock',
            colorMode: 'light',
            title: simpleRteConfig('News'),
          },
          {
            blockType: 'publicationsTeasersBlock',
            title: simpleRteConfig('Publication Teaser'),
          },
          {
            blockType: 'downloadsBlock',
            customOrAuto: 'auto',
            project,
          },
        ],
        hero: {
          colorMode: 'light',
          title: simpleRteConfig(`Project ${time}`),
        },
        ...seoData,
        navigationTitle: 'Project',
        overviewPageProps: {
          linkText: simpleRteConfig('some text'),
          teaserText: simpleRteConfig('some text'),
        },
        parentPage: {
          documentId: home,
          slug: 'homePage',
        },
        project,
        slug: `project-${time}`,
        tenant,
      },
      draft: false,
      locale: 'de',
    });

    await page.goto(`http://localhost:3000/de/project-${time}`);
    await page.waitForLoadState('networkidle');

    const eventsList = await page.locator(':text("Events") + [data-testid="teaser-linklist"]');
    const events = eventsList.getByRole('listitem');

    const newsList = await page.locator(':text("News") + [data-testid="teaser-linklist"]');
    const news = newsList.getByRole('listitem');

    const publicationTeaserList = await page.locator(':text("Publication Teaser") + [data-testid="teaser-linklist"]');
    const publicationTeasers = publicationTeaserList.getByRole('listitem');

    const downloadsList = await page.locator(':text("Download title") + [data-testid="teaser-linklist"]');
    const downloads = downloadsList.getByRole('listitem');

    await expect(events)
      .toHaveCount(5);
    await expect(news)
      .toHaveCount(5);
    await expect(publicationTeasers)
      .toHaveCount(5);
    await expect(downloads)
      .toHaveCount(15);

  });
});

test.describe('Teaser rendering general (sagw)', () => {
  beforeEachAcceptCookies();

  test('correctly shows 3 upcoming events teasers', async ({
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

    await generateEventDetailPage({
      date: '2040-08-01T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `event 1 ${time}`,
    });

    await generateEventDetailPage({
      date: '2040-08-02T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `event 2 ${time}`,
    });

    await generateEventDetailPage({
      date: '2040-08-03T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `event 3 ${time}`,
    });

    await generateEventDetailPage({
      date: '2040-08-04T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `event 4 ${time}`,
    });

    await generateEventDetailPage({
      date: '2040-08-05T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `event 5 ${time}`,
    });

    // past event
    await generateEventDetailPage({
      date: '2025-01-01T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `event 6 ${time}`,
    });

    // add a non-sagw item
    const tenantNonSagw = await getTenantId({
      isSagw: false,
      time,
    });

    const homeNonSagw = await getHomeId({
      isSagw: false,
      tenant: tenantNonSagw,
    });

    await generateEventDetailPage({
      date: '2040-08-01T12:00:00.000Z',
      parentPage: {
        documentId: homeNonSagw,
        slug: 'homePage',
      },
      tenant: tenantNonSagw,
      title: `non-sagw ${time}`,
    });

    await payload.create({
      collection: 'overviewPage',
      data: {
        /* eslint-disable @typescript-eslint/naming-convention */
        _status: 'published',
        /* eslint-enable @typescript-eslint/naming-convention */
        content: [
          {
            blockType: 'eventsTeasersBlock',
            title: simpleRteConfig('Events'),
          },
        ],
        hero: {
          colorMode: 'light',
          title: simpleRteConfig(`Project ${time}`),
        },
        ...seoData,
        navigationTitle: 'Project',
        parentPage: {
          documentId: home,
          slug: 'homePage',
        },
        slug: `overview-${time}`,
        tenant,
      },
      draft: false,
      locale: 'de',
    });

    await page.goto(`http://localhost:3000/de/overview-${time}`);
    await page.waitForLoadState('networkidle');

    const eventsList = await page.locator(':text("Events") + [data-testid="teaser-linklist"]');
    const events = eventsList.getByRole('listitem');
    const title1 = await events.nth(0)
      .getByTestId('eventListItemTitle');
    const title2 = await events.nth(1)
      .getByTestId('eventListItemTitle');
    const title3 = await events.nth(2)
      .getByTestId('eventListItemTitle');

    await expect(events)
      .toHaveCount(3);

    await expect(title1)
      .toHaveText(`event 1 ${time}`);
    await expect(title2)
      .toHaveText(`event 2 ${time}`);
    await expect(title3)
      .toHaveText(`event 3 ${time}`);
  });

  test('correctly shows 3 latest news teasers', async ({
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

    await generateNewsDetailPage({
      date: '2024-08-05T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `news 1 ${time}`,
    });

    await generateNewsDetailPage({
      date: '2024-08-04T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `news 2 ${time}`,
    });

    await generateNewsDetailPage({
      date: '2024-08-03T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `news 3 ${time}`,
    });

    await generateNewsDetailPage({
      date: '2024-08-02T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `news 4 ${time}`,
    });

    await generateNewsDetailPage({
      date: '2024-08-01T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `news 5 ${time}`,
    });

    // add a non-sagw item
    const tenantNonSagw = await getTenantId({
      isSagw: false,
      time,
    });

    const homeNonSagw = await getHomeId({
      isSagw: false,
      tenant: tenantNonSagw,
    });

    await generateNewsDetailPage({
      date: '2024-08-05T12:00:00.000Z',
      parentPage: {
        documentId: homeNonSagw,
        slug: 'homePage',
      },
      tenant: tenantNonSagw,
      title: `non-sagw ${time}`,
    });

    await payload.create({
      collection: 'overviewPage',
      data: {
        /* eslint-disable @typescript-eslint/naming-convention */
        _status: 'published',
        /* eslint-enable @typescript-eslint/naming-convention */
        content: [
          {
            blockType: 'newsTeasersBlock',
            colorMode: 'light',
            title: simpleRteConfig('News'),
          },
        ],
        hero: {
          colorMode: 'light',
          title: simpleRteConfig(`Project ${time}`),
        },
        ...seoData,
        navigationTitle: 'Project',
        parentPage: {
          documentId: home,
          slug: 'homePage',
        },
        slug: `overview-${time}`,
        tenant,
      },
      draft: false,
      locale: 'de',
    });

    await page.goto(`http://localhost:3000/de/overview-${time}`);
    await page.waitForLoadState('networkidle');

    const newsList = await page.locator(':text("News") + [data-testid="teaser-linklist"]');
    const news = newsList.getByRole('listitem');
    const title1 = await news.nth(0)
      .getByTestId('newsListItemTitle');
    const title2 = await news.nth(1)
      .getByTestId('newsListItemTitle');
    const title3 = await news.nth(2)
      .getByTestId('newsListItemTitle');

    await expect(news)
      .toHaveCount(3);

    await expect(title1)
      .toHaveText(`news 1 ${time}`);
    await expect(title2)
      .toHaveText(`news 2 ${time}`);
    await expect(title3)
      .toHaveText(`news 3 ${time}`);
  });

  test('correctly shows 4 latest magazine teasers', async ({
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

    await generateMagazineDetailPage({
      date: '2024-08-05T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `magazine 1 ${time}`,
    });

    await generateMagazineDetailPage({
      date: '2024-08-04T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `magazine 2 ${time}`,
    });

    await generateMagazineDetailPage({
      date: '2024-08-03T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `magazine 3 ${time}`,
    });

    await generateMagazineDetailPage({
      date: '2024-08-02T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `magazine 4 ${time}`,
    });

    await generateMagazineDetailPage({
      date: '2024-08-01T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `magazine 5 ${time}`,
    });

    // add a non-sagw item
    const tenantNonSagw = await getTenantId({
      isSagw: false,
      time,
    });

    const homeNonSagw = await getHomeId({
      isSagw: false,
      tenant: tenantNonSagw,
    });

    await generateMagazineDetailPage({
      date: '2024-08-05T12:00:00.000Z',
      parentPage: {
        documentId: homeNonSagw,
        slug: 'homePage',
      },
      tenant: tenantNonSagw,
      title: `non-sagw ${time}`,
    });

    await payload.create({
      collection: 'overviewPage',
      data: {
        /* eslint-disable @typescript-eslint/naming-convention */
        _status: 'published',
        /* eslint-enable @typescript-eslint/naming-convention */
        content: [
          {
            alignment: 'horizontal',
            blockType: 'magazineTeasersBlock',
            lead: simpleRteConfig('Lead'),
            title: simpleRteConfig('Magazine'),
          },
        ],
        hero: {
          colorMode: 'light',
          title: simpleRteConfig(`Project ${time}`),
        },
        ...seoData,
        navigationTitle: 'Project',
        parentPage: {
          documentId: home,
          slug: 'homePage',
        },
        slug: `overview-${time}`,
        tenant,
      },
      draft: false,
      locale: 'de',
    });

    await page.goto(`http://localhost:3000/de/overview-${time}`);
    await page.waitForLoadState('networkidle');

    const magazineList = await page.getByTestId('generic-teaser-linklist');
    const magazines = magazineList.getByRole('listitem');
    const title1 = await magazines.nth(0)
      .getByTestId('genericTeaserItemTitle');
    const title2 = await magazines.nth(1)
      .getByTestId('genericTeaserItemTitle');
    const title3 = await magazines.nth(2)
      .getByTestId('genericTeaserItemTitle');
    const title4 = await magazines.nth(3)
      .getByTestId('genericTeaserItemTitle');

    await expect(magazines)
      .toHaveCount(4);

    await expect(title1)
      .toHaveText(`magazine 1 ${time}`);
    await expect(title2)
      .toHaveText(`magazine 2 ${time}`);
    await expect(title3)
      .toHaveText(`magazine 3 ${time}`);
    await expect(title4)
      .toHaveText(`magazine 4 ${time}`);
  });

  test('correctly shows 4 latest publications teasers', async ({
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

    await generatePublicationDetailPage({
      date: '2024-08-05T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `publication 1 ${time}`,
    });

    await generatePublicationDetailPage({
      date: '2024-08-04T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `publication 2 ${time}`,
    });

    await generatePublicationDetailPage({
      date: '2024-08-03T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `publication 3 ${time}`,
    });

    await generatePublicationDetailPage({
      date: '2024-08-02T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `publication 4 ${time}`,
    });

    await generatePublicationDetailPage({
      date: '2024-08-01T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `publication 5 ${time}`,
    });

    // add a non-sagw item
    const tenantNonSagw = await getTenantId({
      isSagw: false,
      time,
    });

    const homeNonSagw = await getHomeId({
      isSagw: false,
      tenant: tenantNonSagw,
    });

    await generatePublicationDetailPage({
      date: '2024-08-05T12:00:00.000Z',
      parentPage: {
        documentId: homeNonSagw,
        slug: 'homePage',
      },
      tenant: tenantNonSagw,
      title: `non-sagw ${time}`,
    });

    await payload.create({
      collection: 'overviewPage',
      data: {
        /* eslint-disable @typescript-eslint/naming-convention */
        _status: 'published',
        /* eslint-enable @typescript-eslint/naming-convention */
        content: [
          {
            blockType: 'publicationsTeasersBlock',
            title: simpleRteConfig('Publications'),
          },
        ],
        hero: {
          colorMode: 'light',
          title: simpleRteConfig(`Project ${time}`),
        },
        ...seoData,
        navigationTitle: 'Project',
        parentPage: {
          documentId: home,
          slug: 'homePage',
        },
        slug: `overview-${time}`,
        tenant,
      },
      draft: false,
      locale: 'de',
    });

    await page.goto(`http://localhost:3000/de/overview-${time}`);
    await page.waitForLoadState('networkidle');

    const publicationList = await page.getByTestId('teaser-linklist');
    const publications = publicationList.getByRole('listitem');
    const title1 = await publications.nth(0)
      .getByTestId('publicationsListItemTitle');
    const title2 = await publications.nth(1)
      .getByTestId('publicationsListItemTitle');
    const title3 = await publications.nth(2)
      .getByTestId('publicationsListItemTitle');
    const title4 = await publications.nth(3)
      .getByTestId('publicationsListItemTitle');

    await expect(publications)
      .toHaveCount(4);

    await expect(title1)
      .toHaveText(`publication 1 ${time}`);
    await expect(title2)
      .toHaveText(`publication 2 ${time}`);
    await expect(title3)
      .toHaveText(`publication 3 ${time}`);
    await expect(title4)
      .toHaveText(`publication 4 ${time}`);
  });

  test('correctly shows 3 latest projects teasers', async ({
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

    await generateProjectDetailPage({
      date: '2024-08-01T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `project 1 ${time}`,
    });

    await generateProjectDetailPage({
      date: '2024-08-02T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `project 2 ${time}`,
    });

    await generateProjectDetailPage({
      date: '2024-08-03T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `project 3 ${time}`,
    });

    await generateProjectDetailPage({
      date: '2024-08-04T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `project 4 ${time}`,
    });

    await generateProjectDetailPage({
      date: '2024-08-05T12:00:00.000Z',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `project 5 ${time}`,
    });

    // add a non-sagw item
    const tenantNonSagw = await getTenantId({
      isSagw: false,
      time,
    });

    const homeNonSagw = await getHomeId({
      isSagw: false,
      tenant: tenantNonSagw,
    });

    await generateProjectDetailPage({
      date: '2024-08-05T12:00:00.000Z',
      parentPage: {
        documentId: homeNonSagw,
        slug: 'homePage',
      },
      tenant: tenantNonSagw,
      title: `non-sagw ${time}`,
    });

    await payload.create({
      collection: 'overviewPage',
      data: {
        /* eslint-disable @typescript-eslint/naming-convention */
        _status: 'published',
        /* eslint-enable @typescript-eslint/naming-convention */
        content: [
          {
            alignment: 'vertical',
            blockType: 'projectsTeasersBlock',
            lead: simpleRteConfig('Lead'),
            title: simpleRteConfig('Projects'),
          },
        ],
        hero: {
          colorMode: 'light',
          title: simpleRteConfig(`Project ${time}`),
        },
        ...seoData,
        navigationTitle: 'Project',
        parentPage: {
          documentId: home,
          slug: 'homePage',
        },
        slug: `overview-${time}`,
        tenant,
      },
      draft: false,
      locale: 'de',
    });

    await page.goto(`http://localhost:3000/de/overview-${time}`);
    await page.waitForLoadState('networkidle');

    const publicationList = await page.getByTestId('projects-teaser-linklist');
    const publications = publicationList.getByRole('listitem');
    const title1 = await publications.nth(0)
      .getByTestId('genericTeaserItemTitle');
    const title2 = await publications.nth(1)
      .getByTestId('genericTeaserItemTitle');
    const title3 = await publications.nth(2)
      .getByTestId('genericTeaserItemTitle');

    await expect(publications)
      .toHaveCount(3);

    await expect(title1)
      .toHaveText(`project 5 ${time}`);
    await expect(title2)
      .toHaveText(`project 4 ${time}`);
    await expect(title3)
      .toHaveText(`project 3 ${time}`);
  });
});
