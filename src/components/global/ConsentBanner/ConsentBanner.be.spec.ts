import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import {
  expect,
  test,
} from '@playwright/test';

test.describe('Consent Banner', () => {
  test.beforeEach(async () => {

    // delete data
    await deleteSetsPages();
    await deleteOtherCollections();
  });

  test('shows banner if no consent was given', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/de');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const banner = await page.getByTestId('consent-banner');

    await expect(banner)
      .toBeVisible();
  });

  test('does not show banner if consent was given', async ({
    context,
    page,
  }) => {
    await context.addCookies([
      {
        domain: 'localhost',
        name: 'cookie_consent',
        path: '/',
        value: '{"analytics":true,"consentGiven":true,"essential":true,"external":true,"timestamp":1762095991926}',
      },
    ]);

    await page.goto('http://localhost:3000/de');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const banner = await page.getByTestId('consent-banner');

    await expect(banner)
      .not.toBeVisible();
  });

  test('sets correct cookie values on "Accept All"', async ({
    context,
    page,
  }) => {
    await page.goto('http://localhost:3000/de');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const banner = await page.getByTestId('consent-banner');
    const acceptAll = await banner.getByText('Alle zulassen');

    await acceptAll.click();

    await expect(banner)
      .not.toBeVisible();

    const cookies = await context.cookies();

    const consentCookies = cookies.filter((cookie) => cookie.name === 'cookie_consent');
    const [consentCookie] = consentCookies;
    const consentValues = JSON.parse(decodeURIComponent(consentCookie.value));

    await expect(consentValues.analytics)
      .toBe(true);

    await expect(consentValues.consentGiven)
      .toBe(true);

    await expect(consentValues.essential)
      .toBe(true);

    await expect(consentValues.external)
      .toBe(true);
  });

  test('sets correct cookie values on "Decline All"', async ({
    context,
    page,
  }) => {
    await page.goto('http://localhost:3000/de');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const banner = await page.getByTestId('consent-banner');
    const acceptAll = await banner.getByText('Alle ablehnen');

    await acceptAll.click();

    await expect(banner)
      .not.toBeVisible();

    const cookies = await context.cookies();

    const consentCookies = cookies.filter((cookie) => cookie.name === 'cookie_consent');
    const [consentCookie] = consentCookies;
    const consentValues = JSON.parse(decodeURIComponent(consentCookie.value));

    await expect(consentValues.analytics)
      .toBe(false);

    await expect(consentValues.consentGiven)
      .toBe(true);

    await expect(consentValues.essential)
      .toBe(true);

    await expect(consentValues.external)
      .toBe(false);
  });

  test('has focus inside initially', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/de');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const banner = await page.getByTestId('consent-banner');
    const link = banner.getByText('Datenschutzrichtlinien');

    await expect(link)
      .toBeFocused();
  });

  test('locks focus inside', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/de');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const banner = await page.getByTestId('consent-banner');
    const link = banner.getByText('Datenschutzrichtlinien');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await expect(link)
      .toBeFocused();
  });

  test('opens overlay', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/de');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const banner = await page.getByTestId('consent-banner');
    const overlay = await page.getByTestId('consent-overlay');
    const overlayButton = await banner.getByText('Auswahl anpassen');

    await overlayButton.click();
    await expect(overlay)
      .toBeVisible();
  });
});
