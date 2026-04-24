import {
  expect,
  test,
} from '@playwright/test';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getTenantId } from '@/test-helpers/tenant-generator';
import {
  generateDetailPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { extendExpect } from '@/access/test/extendExpect';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';

extendExpect(expect);

test.describe('Render page', () => {
  beforeEachAcceptCookies();

  test('does not render unpublished pages', async ({
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

    const detailPage = await generateDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      title: `detail-${time}`,
    });

    // check proper render first

    await page.goto(`http://localhost:3000/de/detail-${time}`);
    await page.waitForLoadState('networkidle');

    // expect page is displayed

    const expectedTitle = await page.getByText(`detail-${time}`, {
      exact: true,
    });

    await expect(expectedTitle)
      .toBeVisible();

    // expect 404

    await payload.update({
      collection: 'detailPage',
      data: {
        /* eslint-disable @typescript-eslint/naming-convention */
        _status: 'draft',
        /* eslint-enable @typescript-eslint/naming-convention */
      },
      id: detailPage.id,
    });

    await page.goto(`http://localhost:3000/de/detail-${time}`);
    await page.waitForLoadState('networkidle');

    const expectedTitle2 = await page.getByText('Not found title SAGW', {
      exact: true,
    });

    await expect(expectedTitle)
      .not.toBeVisible();
    await expect(expectedTitle2)
      .toBeVisible();

  });
});
