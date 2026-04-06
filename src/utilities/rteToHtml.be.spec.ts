import {
  expect,
  test,
} from '@playwright/test';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getTenant } from '@/test-helpers/tenant-generator';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';
import {
  generateCollectionsExceptPages, generateOverviewPage,
} from '@/test-helpers/collections-generator';
import {
  rte3NotificationText, rte3NotificationTextWithMail,
} from '@/utilities/rteSampleContent';

test.describe('Properly renders', () => {
  beforeEachAcceptCookies();

  test('external links', async ({
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

    await generateOverviewPage({
      content: [
        {
          blockType: 'notificationBlock',
          show: 'true',
          text: rte3NotificationText,
        },
      ],
      locale: 'de',
      parentPage: {
        documentId: home.docs[0].id,
        slug: 'homePage',
      },
      tenant: tenant || '',
      title: `overview-${time}`,
    });

    await page.goto(`http://localhost:3000/de/overview-${time}`);
    await page.waitForLoadState('networkidle');

    const notification = await page.getByTestId('notification')
      .nth(1);

    await expect(notification)
      .toHaveScreenshot();

  });

  test('email addresses', async ({
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

    await generateOverviewPage({
      content: [
        {
          blockType: 'notificationBlock',
          show: 'true',
          text: rte3NotificationTextWithMail,
        },
      ],
      locale: 'de',
      parentPage: {
        documentId: home.docs[0].id,
        slug: 'homePage',
      },
      tenant: tenant || '',
      title: `overview-${time}`,
    });

    await page.goto(`http://localhost:3000/de/overview-${time}`);
    await page.waitForLoadState('networkidle');

    const notification = await page.getByTestId('notification')
      .nth(1);

    await expect(notification)
      .toHaveScreenshot();

  });
});
