import {
  expect,
  test,
} from '@playwright/test';
import {
  generateEventDetailPage,
  generateNewsDetailPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';

test.describe('properly renders date range in german', () => {
  beforeEachAcceptCookies();

  test('single date', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-08-01T12:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'de',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T12:00:00.000Z',
      title: `event ${time}`,
    });

    await page.goto(`http://localhost:3000/de/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('01. August 2030 — 12:00 Uhr');
  });

  test('date range same day, month and year', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-08-01T12:00:00.000Z',
      dateEnd: '2030-08-01T12:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'de',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T12:00:00.000Z',
      title: `event ${time}`,
    });

    await page.goto(`http://localhost:3000/de/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('01. August 2030 — 12:00 Uhr');
  });

  test('date range same month and year', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-08-01T12:00:00.000Z',
      dateEnd: '2030-08-02T12:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'de',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T12:00:00.000Z',
      title: `event ${time}`,
    });

    await page.goto(`http://localhost:3000/de/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('01.–02. August 2030 — 12:00 Uhr');
  });

  test('date range same year', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-08-01T12:00:00.000Z',
      dateEnd: '2030-09-02T12:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'de',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T12:00:00.000Z',
      title: `event ${time}`,
    });

    await page.goto(`http://localhost:3000/de/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('01. August – 02. September 2030 — 12:00 Uhr');
  });

  test('date range different years', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-08-01T12:00:00.000Z',
      dateEnd: '2031-01-01T12:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'de',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T12:00:00.000Z',
      title: `event ${time}`,
    });

    await page.goto(`http://localhost:3000/de/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('01. August 2030 – 01. Januar 2031 — 12:00 Uhr');
  });
});

test.describe('properly renders date range in english', () => {
  beforeEachAcceptCookies();

  test('single date', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-02-01T13:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'en',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T13:00:00.000Z',
      title: `event ${time}`,
    });

    await page.goto(`http://localhost:3000/en/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('February 01, 2030 — 01:00 PM');
  });

  test('date range same day, month and year', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-02-01T12:00:00.000Z',
      dateEnd: '2030-02-01T12:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'en',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T13:00:00.000Z',
      title: `event ${time}`,
    });

    await page.goto(`http://localhost:3000/en/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('February 01, 2030 — 01:00 PM');
  });

  test('date range same month and year', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-03-01T12:00:00.000Z',
      dateEnd: '2030-03-02T12:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'en',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T13:00:00.000Z',
      title: `event ${time}`,
    });

    await page.goto(`http://localhost:3000/en/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('March 01 – 02, 2030 — 01:00 PM');
  });

  test('date range same year', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-02-01T12:00:00.000Z',
      dateEnd: '2030-03-02T12:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'en',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T13:00:00.000Z',
      title: `event ${time}`,
    });

    await page.goto(`http://localhost:3000/en/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('February 01 – March 02, 2030 — 01:00 PM');
  });

  test('date range different years', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-01-01T12:00:00.000Z',
      dateEnd: '2031-02-01T12:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'en',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T13:00:00.000Z',
      title: `event ${time}`,
    });

    await page.goto(`http://localhost:3000/en/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('January 01, 2030 – February 01, 2031 — 01:00 PM');
  });
});

// TODO: find fix and enable again (failes on ci, passes locally)
/* eslint-disable no-irregular-whitespace */
/*
test.describe('properly renders date range in french', () => {
  beforeEachAcceptCookies();

  test('single date', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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

    const temp = await generateEventDetailPage({
      date: '2030-02-01T13:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'fr',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T13:00:00.000Z',
      title: `event-${time}`,
    });

    console.log('######## tmp page');
    console.log(temp);

    await page.goto(`http://localhost:3000/fr/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('01 février 2030 — 13:00');
  });

  test('date range same day, month and year', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-02-01T12:00:00.000Z',
      dateEnd: '2030-02-01T12:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'fr',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T13:00:00.000Z',
      title: `event-${time}`,
    });

    await page.goto(`http://localhost:3000/fr/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('01 février 2030 — 13:00');
  });

  test('date range same month and year', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-03-01T12:00:00.000Z',
      dateEnd: '2030-03-02T12:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'fr',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T13:00:00.000Z',
      title: `event-${time}`,
    });

    await page.goto(`http://localhost:3000/fr/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('01–02 mars 2030 — 13:00');
  });

  test('date range same year', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-02-01T12:00:00.000Z',
      dateEnd: '2030-03-02T12:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'fr',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T13:00:00.000Z',
      title: `event-${time}`,
    });

    await page.goto(`http://localhost:3000/fr/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('01 février – 02 mars 2030 — 13:00');
  });

  test('date range different years', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-01-01T12:00:00.000Z',
      dateEnd: '2031-02-01T12:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'fr',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T13:00:00.000Z',
      title: `event-${time}`,
    });

    await page.goto(`http://localhost:3000/fr/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('01 janvier 2030 – 01 février 2031 — 13:00');
  });
});
*/
/* eslint-enable no-irregular-whitespace */

test.describe('properly renders date range in italian', () => {
  beforeEachAcceptCookies();

  test('single date', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-02-01T13:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'it',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T13:00:00.000Z',
      title: `event ${time}`,
    });

    await page.goto(`http://localhost:3000/it/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('01 febbraio 2030 — 13:00');
  });

  test('date range same day, month and year', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-02-01T12:00:00.000Z',
      dateEnd: '2030-02-01T12:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'it',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T13:00:00.000Z',
      title: `event ${time}`,
    });

    await page.goto(`http://localhost:3000/it/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('01 febbraio 2030 — 13:00');
  });

  test('date range same month and year', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-03-01T12:00:00.000Z',
      dateEnd: '2030-03-02T12:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'it',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T13:00:00.000Z',
      title: `event ${time}`,
    });

    await page.goto(`http://localhost:3000/it/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('01–02 marzo 2030 — 13:00');
  });

  test('date range same year', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-02-01T12:00:00.000Z',
      dateEnd: '2030-03-02T12:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'it',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T13:00:00.000Z',
      title: `event ${time}`,
    });

    await page.goto(`http://localhost:3000/it/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('01 febbraio – 02 marzo 2030 — 13:00');
  });

  test('date range different years', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-01-01T12:00:00.000Z',
      dateEnd: '2031-02-01T12:00:00.000Z',
      hideLanguage: true,
      hideLocation: true,
      locale: 'it',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      time: '2025-08-31T13:00:00.000Z',
      title: `event ${time}`,
    });

    await page.goto(`http://localhost:3000/it/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('eventdetails')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('01 gennaio 2030 – 01 febbraio 2031 — 13:00');
  });
});

test.describe('properly renders single date in german', () => {
  beforeEachAcceptCookies();

  test('single date', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-08-01T12:00:00.000Z',
      locale: 'de',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `event ${time}`,
    });

    await page.goto(`http://localhost:3000/de/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('news-date')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('01. August 2030');
  });
});

test.describe('properly renders single date in english', () => {
  beforeEachAcceptCookies();

  test('single date', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-08-01T12:00:00.000Z',
      locale: 'en',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `event ${time}`,
    });

    await page.goto(`http://localhost:3000/en/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('news-date')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('August 01, 2030');
  });
});

// TODO: find fix and enable again (failes on ci, passes locally)
/*
test.describe('properly renders single date in french', () => {
  beforeEachAcceptCookies();

  test('single date', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-08-01T12:00:00.000Z',
      locale: 'fr',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `event ${time}`,
    });

    await page.goto(`http://localhost:3000/fr/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('news-date')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('01 août 2030');
  });
});
*/

test.describe('properly renders single date in italian', () => {
  beforeEachAcceptCookies();

  test('single date', async ({
    page,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

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
      date: '2030-08-01T12:00:00.000Z',
      locale: 'it',
      navigationTitle: 'nav title',
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `event ${time}`,
    });

    await page.goto(`http://localhost:3000/it/event-${time}`);
    await page.waitForLoadState('networkidle');

    const eventDetails = await page.getByTestId('news-date')
      .textContent();

    await expect(eventDetails)
      .toStrictEqual('01 agosto 2030');
  });
});
