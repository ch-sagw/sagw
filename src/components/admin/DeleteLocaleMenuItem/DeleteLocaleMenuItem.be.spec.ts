import {
  expect,
  type Page,
  test,
} from '@playwright/test';
import { beforeEachPayloadLogin } from '@/test-helpers/payload-login';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import {
  enableAllTenantLanguages, getTenantId,
} from '@/test-helpers/tenant-generator';
import {
  generateDetailPageInAllLocales, getHomeId,
} from '@/test-helpers/collections-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';

const buttonSelector = '#delete-locale-variant__button';
const threeDotsSelector = '.popup.doc-controls__popup button.popup-button';

// the popup content is portaled to document.body, so we use payload's
// built-in delete entry to make sure the menu is open
const builtInDeleteSelector = '#action-delete';

// Opens the edit view 3-dot menu. On slow machines (CI, next dev) the page
// reaches "networkidle" before react has hydrated; a click at that moment is
// lost and the popup never opens. So we click until the menu is really open.
const openDocControlsMenu = async (page: Page): Promise<void> => {
  await page.waitForLoadState('networkidle');

  await expect(async () => {
    await page.locator(threeDotsSelector)
      .click({
        force: true,
      });

    await expect(page.locator(builtInDeleteSelector))
      .toBeVisible({
        timeout: 1_000,
      });
  })
    .toPass({
      timeout: 30_000,
    });
};

test.describe('Admin: delete language variant menu item', () => {
  beforeEachPayloadLogin();

  test('is hidden in the default locale, visible in fr, and deletes the fr variant on confirm', async ({
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

    // the admin locale switcher only offers the languages enabled on the
    // tenant; an earlier test may have disabled fr on the sagw tenant, in
    // which case `?locale=fr` silently falls back to de.
    await enableAllTenantLanguages(tenant);

    const home = await getHomeId({
      isSagw: true,
      tenant,
    });

    const detail = await generateDetailPageInAllLocales({
      parentCollection: 'homePage',
      parentId: home,
      tenant,
      title: `detail ${time}`,
    });

    const editUrl = `http://localhost:3000/admin/collections/detailPage/${detail.id}`;

    // --------------------------------------------------------------
    // default locale (de): menu item must not be rendered
    // --------------------------------------------------------------
    await page.goto(`${editUrl}?locale=de`);
    await openDocControlsMenu(page);

    // the menu is open (built-in delete entry), our locale entry is not there
    await expect(page.locator(buttonSelector))
      .toHaveCount(0);

    // --------------------------------------------------------------
    // fr: menu item visible, confirm deletes the variant
    // --------------------------------------------------------------
    await page.goto(`${editUrl}?locale=fr`);
    await openDocControlsMenu(page);

    const deleteLocaleButton = page.locator(buttonSelector);

    await expect(deleteLocaleButton)
      .toBeVisible();

    await deleteLocaleButton.click();

    const confirmButton = page.locator('#confirm-action');

    await expect(confirmButton)
      .toBeVisible();

    const responsePromise = page.waitForResponse((response) => response.url()
      .includes(`/api/detailPage/${detail.id}/delete-locale`));

    await confirmButton.click();

    const response = await responsePromise;

    expect(response.status())
      .toBe(200);

    // success toast
    await expect(page.locator('.payload-toast-container .toast-success'))
      .toBeVisible();

    // database: fr removed, de intact
    const raw = await payload.db.findOne<Record<string, any> & { id: string }>({
      collection: 'detailPage',
      where: {
        id: {
          equals: detail.id,
        },
      },
    });

    expect(raw?.slug?.fr)
      .toBeUndefined();
    expect(raw?.slug?.de)
      .toBeTruthy();

    // --------------------------------------------------------------
    // fr again: no variant left (empty slug) -> menu item hidden
    // --------------------------------------------------------------
    await page.goto(`${editUrl}?locale=fr`);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('#field-slug'))
      .toHaveValue('');

    await openDocControlsMenu(page);

    await expect(page.locator(buttonSelector))
      .toHaveCount(0);

    // --------------------------------------------------------------
    // it: still available for a locale that was not deleted
    // --------------------------------------------------------------
    await page.goto(`${editUrl}?locale=it`);
    await openDocControlsMenu(page);

    await expect(page.locator(buttonSelector))
      .toBeVisible();
  });
});
