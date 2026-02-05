import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getTenantId } from '@/test-helpers/tenant-generator';
import {
  generateDetailPage, getHomeId,
} from '@/test-helpers/collections-generator';
import { extendExpect } from '@/access/test/extendExpect';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

extendExpect(expect);

test.describe('Slug field UI', () => {
  beforeEachPayloadLogin();

  test('gets populated correctly', async ({
    page,
  }) => {

    await deleteSetsPages();
    await deleteOtherCollections();

    await page.goto('http://localhost:3000/admin/collections/detailPage/create');
    await page.waitForLoadState('networkidle');

    const heroField = await page.locator('#field-hero .rich-text-lexical:first-of-type .ContentEditable__root')
      .nth(0);
    const hyphenButton = await page.locator('#field-hero .rich-text-lexical:first-of-type .toolbar-popup__button-softHyphenButton');
    const nbspButton = await page.locator('#field-hero .rich-text-lexical:first-of-type .toolbar-popup__button-nonBreakingSpaceButton');
    const superscriptButton = await page.locator('#field-hero .rich-text-lexical:first-of-type .toolbar-popup__button-superscript');
    const subscriptButton = await page.locator('#field-hero .rich-text-lexical:first-of-type .toolbar-popup__button-subscript');

    await heroField.fill('Sample Detail. Page. $name üöä');

    await hyphenButton.click();
    await nbspButton.click();
    await heroField.pressSequentially('hyphen');
    await superscriptButton.click();
    await heroField.pressSequentially('sup');
    await subscriptButton.click();
    await heroField.pressSequentially('sub');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Publish changes',
    });

    await saveButton.click();

    // wait for confirmation toast and close it
    const closeToast = await page.locator('.payload-toast-container [data-close-button="true"]');

    await closeToast.click();

    // wait for refresh
    const title = await page.getByRole('heading', {
      name: 'Sample Detail. Page.',
    });

    await expect(title)
      .toBeVisible();

    const slugField = await page.locator('#field-slug');

    await expect(slugField)
      .toHaveValue('sample-detail-page-dollarname-ueoeae-hyphensupsub');

  });

});

test.describe('Slug field API', () => {
  test('checks for unique slug in same tenant', async () => {
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

    await generateDetailPage({
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      title: `detail ${time}`,
    });

    await expect(async () => {
      await payload.create({
        collection: 'detailPage',
        data: {
          /* eslint-disable @typescript-eslint/naming-convention */
          _status: 'published',
          /* eslint-enable @typescript-eslint/naming-convention */
          hero: {
            colorMode: 'dark',
            title: simpleRteConfig(`detail ${time}`),
          },
          navigationTitle: 'Some navigation title',
          parentPage: {
            documentId: home,
            slug: 'homePage',
          },
          slug: `detail-${time}`,
          tenant,
        },
        draft: false,
      });
    })
      .rejects.toMatchObject({
        data: {
          errors: [
            {
              message: `Slug "detail-${time}" already exists in this tenant`,
              path: 'slug',
            },
          ],
        },
        status: 400,
      });
  });

  test('does not error if slug exists in other tenant', async () => {
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

    const tenantNotSagw = await getTenantId({
      isSagw: false,
      time: time + Math.floor(Math.random() * 1000000),
    });

    const homeNotSagw = await getHomeId({
      isSagw: false,
      tenant: tenantNotSagw,
    });

    // detail page not sagw
    await generateDetailPage({
      locale: 'de',
      parentPage: {
        documentId: homeNotSagw,
        slug: 'homePage',
      },
      tenant: tenantNotSagw,
      title: `detail 1 ${time}`,
    });

    await expect(async () => {
      const foo = await payload.create({
        collection: 'detailPage',
        data: {
          /* eslint-disable @typescript-eslint/naming-convention */
          _status: 'published',
          /* eslint-enable @typescript-eslint/naming-convention */
          hero: {
            colorMode: 'dark',
            title: simpleRteConfig(`detail 2 ${time}`),
          },
          navigationTitle: 'nav title',
          parentPage: {
            documentId: home,
            slug: 'homePage',
          },
          slug: `detail-2-${time}`,
          tenant,
        },
        draft: false,
        locale: 'de',
      });

      console.log(foo);

    })
      .notRejects();
  });

});
