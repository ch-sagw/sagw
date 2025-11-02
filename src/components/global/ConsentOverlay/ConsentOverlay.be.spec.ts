import {
  expect,
  test,
} from '@playwright/test';

test.describe('Consent Overlay', () => {

  test('has focus inside initially', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const banner = await page.getByTestId('consent-banner');
    const overlay = await page.getByTestId('consent-overlay');
    const overlayButton = await banner.getByText('Auswahl anpassen');
    const close = overlay.getByTestId('consent-overlay-close');

    await overlayButton.click();

    await expect(close)
      .toBeFocused();
  });

  test('locks focus inside', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const banner = await page.getByTestId('consent-banner');
    const overlay = await page.getByTestId('consent-overlay');
    const overlayButton = await banner.getByText('Auswahl anpassen');
    const close = overlay.getByTestId('consent-overlay-close');

    await overlayButton.click();

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await expect(close)
      .toBeFocused();
  });

  test('sets correct cookie values on "Accept all"', async ({
    context,
    page,
  }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const banner = await page.getByTestId('consent-banner');
    const overlayButton = await banner.getByText('Auswahl anpassen');

    await overlayButton.click();

    const overlay = await page.getByTestId('consent-overlay');
    const acceptAll = await overlay.getByText('Alle zulassen');

    await acceptAll.click();

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

  test('sets correct cookie values on disabling toggles', async ({
    context,
    page,
  }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const banner = await page.getByTestId('consent-banner');
    const overlayButton = await banner.getByText('Auswahl anpassen');

    await overlayButton.click();

    const overlay = await page.getByTestId('consent-overlay');
    const toggle1 = await overlay.locator('#analytics');
    const toggle2 = await overlay.locator('#external');
    const button = await overlay.getByText('Auswahl zulassen');

    await toggle1.click({
      force: true,
    });
    await toggle2.click({
      force: true,
    });

    await button.click();

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

  test('closes on close button', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const banner = await page.getByTestId('consent-banner');
    const overlay = await page.getByTestId('consent-overlay');
    const overlayButton = await banner.getByText('Auswahl anpassen');
    const close = overlay.getByTestId('consent-overlay-close');

    await overlayButton.click();
    await close.click();

    await expect(overlay)
      .not.toBeVisible();
  });

});
