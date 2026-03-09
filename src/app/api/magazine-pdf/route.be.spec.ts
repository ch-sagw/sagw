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
import { deleteSetsPages } from '@/seed/test-data/deleteData';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';

test.describe('magazine pdf route', () => {
  beforeEachAcceptCookies();

  test('exports magazine detail page as downloadable PDF', async ({
    page,
  }) => {
    await deleteSetsPages();

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

    await generateMagazineDetailPage({
      navigationTitle: `magazine detail ${time}`,
      parentPage: {
        documentId: overviewPage.id,
        slug: 'overviewPage',
      },
      title: `magazine detail ${time}`,
    });

    await page.goto(`http://localhost:3000/de/overview-${time}/magazine-detail-${time}`);
    await page.waitForLoadState('networkidle');

    const exportButton = page.locator('[data-magazine-detail-extras="true"] [data-testid="button"]')
      .first();

    await expect(exportButton)
      .toBeVisible();

    const responsePromise = page.waitForResponse((response) => response.url()
      .includes('/api/magazine-pdf?') && response.status() === 200);
    const downloadPromise = page.waitForEvent('download');

    await exportButton.click();

    const pdfResponse = await responsePromise;
    const download = await downloadPromise;
    const contentType = pdfResponse.headers()['content-type'];
    const contentDisposition = pdfResponse.headers()['content-disposition'];
    const suggestedFilename = download.suggestedFilename();

    await expect(contentType)
      .toContain('application/pdf');
    await expect(contentDisposition)
      .toContain('attachment; filename=');
    await expect(suggestedFilename)
      .toContain('.pdf');
  });
});
