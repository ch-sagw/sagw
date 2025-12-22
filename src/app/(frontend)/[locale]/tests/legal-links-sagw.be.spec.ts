import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';

test.describe('Legal links', () => {
  beforeEachAcceptCookies();
  test('rendered correctly', {
    tag: '@linking',
  }, async ({
    page,
  }) => {

    // #########################################
    // verify correct url rendering: de
    // #########################################
    await page.goto('http://localhost:3000/de');
    await page.waitForLoadState('networkidle');

    const linkDataPrivacy = await page.getByRole('link', {
      name: 'Legal SAGW',
    })
      .getAttribute('href');

    const linkImpressum = await page.getByRole('link', {
      name: 'Impressum SAGW',
    })
      .getAttribute('href');

    await expect(linkDataPrivacy)
      .toStrictEqual('/de/data-privacy-de');

    await expect(linkImpressum)
      .toStrictEqual('/de/impressum-de');

    // #########################################
    // verify correct url rendering: it
    // #########################################
    await page.goto('http://localhost:3000/it');
    await page.waitForLoadState('networkidle');

    const linkDataPrivacyIt = await page.getByRole('link', {
      name: 'Legal SAGW',
    })
      .getAttribute('href');

    const linkImpressumIt = await page.getByRole('link', {
      name: 'Impressum SAGW',
    })
      .getAttribute('href');

    await expect(linkDataPrivacyIt)
      .toStrictEqual('/it/data-privacy-it');

    await expect(linkImpressumIt)
      .toStrictEqual('/it/impressum-it');

  });
});
