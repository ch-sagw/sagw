import {
  expect, test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';

import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';

import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';
import {
  generateDetailPage, generateOverviewPage, getHomeId,
} from '@/test-helpers/collections-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

test.describe('Preview buttons', () => {
  beforeEachPayloadLogin();
  beforeEachAcceptCookies();

  test('corretly open draft/published preview (sagw)', async ({
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

    const overviewPage = await generateOverviewPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      title: `overview-${time}`,
    });

    // create draft content
    const detailPage = await generateDetailPage({
      draft: true,
      parentPage: {
        documentId: overviewPage.id,
        slug: 'overviewPage',
      },
      title: `detail-${time} changed in draft`,
    });

    // test draft preview

    await page.goto(`http://localhost:3000/admin/collections/detailPage/${detailPage.id}`);
    await page.waitForLoadState('networkidle');

    const buttons = await page.getByTestId('preview-buttons');
    const draft = await buttons.locator('#preview-button');

    const [draftPreviewPage] = await Promise.all([
      page.waitForEvent('popup'),
      draft.click(),
    ]);

    await draftPreviewPage.waitForLoadState('domcontentloaded');

    const draftHero = await draftPreviewPage.locator('#content');

    await expect(draftHero)
      .toHaveText(`detail-${time} changed in draft`);

    await expect(draftPreviewPage)
      .toHaveURL(`http://localhost:3000/de/overview-${time}/detail-${time}-changed-in-draft`);

    // test published preview

    // update draft
    await payload.update({
      collection: 'detailPage',
      data: {
        /* eslint-disable @typescript-eslint/naming-convention */
        _status: 'published',
        /* eslint-enable @typescript-eslint/naming-convention */

        hero: {
          title: simpleRteConfig(`detail-${time} original published`),
        },
      },
      id: detailPage.id,
    });

    await page.goto(`http://localhost:3000/admin/collections/detailPage/${detailPage.id}`);
    await page.waitForLoadState('networkidle');

    const published = await buttons.locator('#page-edit-open-published-site');

    const [publishedPreviewPage] = await Promise.all([
      page.waitForEvent('popup'),
      published.click(),
    ]);

    await publishedPreviewPage.waitForLoadState('domcontentloaded');

    const publishedHero = await publishedPreviewPage.locator('#content');

    await expect(publishedHero)
      .toHaveText(`detail-${time} original published`);

    await expect(draftPreviewPage)
      .toHaveURL(`http://localhost:3000/de/overview-${time}/detail-${time}-changed-in-draft`);
  });
});
