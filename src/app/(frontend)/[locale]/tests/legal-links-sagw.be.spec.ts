import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getTenant } from '@/test-helpers/tenant-generator';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

test.describe('Legal links (sagw)', () => {
  beforeEachAcceptCookies();
  test('rendered correctly', {
    tag: '@linking',
  }, async ({
    page,
  }) => {
    const payload = await getPayloadCached();
    const tenant = await getTenant();

    // #########################################
    // ensure proper legal links
    // #########################################
    const originalFooterData = await payload.find({
      collection: 'footer',
      where: {
        tenant: {
          equals: tenant,
        },
      },
    });

    await payload.update({
      collection: 'footer',
      data: {
        ...originalFooterData.docs[0],
        legal: {
          ...originalFooterData.docs[0].legal,
          dataPrivacy: simpleRteConfig('[test]footer-data-privacy:link'),
          impressum: simpleRteConfig('[test]footer-impressum:link'),
        },
      },
      id: originalFooterData.docs[0].id,
    });

    // #########################################
    // verify correct url rendering: de
    // #########################################
    await page.goto('http://localhost:3000/de');
    await page.waitForLoadState('networkidle');

    const linkDataPrivacy = await page.getByRole('link', {
      name: '[test]footer-data-privacy:link',
    })
      .getAttribute('href');

    const linkImpressum = await page.getByRole('link', {
      name: '[test]footer-impressum:link',
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
      name: '[test]footer-data-privacy:link',
    })
      .getAttribute('href');

    const linkImpressumIt = await page.getByRole('link', {
      name: '[test]footer-impressum:link',
    })
      .getAttribute('href');

    await expect(linkDataPrivacyIt)
      .toStrictEqual('/it/data-privacy-it');

    await expect(linkImpressumIt)
      .toStrictEqual('/it/impressum-it');

  });
});
