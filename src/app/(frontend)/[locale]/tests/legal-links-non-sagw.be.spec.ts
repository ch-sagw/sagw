import {
  expect,
  test,
} from '@playwright/test';
import { beforeEachAcceptCookies } from '@/test-helpers/cookie-consent';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { generateTenant } from '@/test-helpers/tenant-generator';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  generateConsentData,
  generateDataPrivacyPage,
  generateFooterData,
  generateHeaderData,
  generateHomePage,
  generateI18nData,
  generateImpressumPage,
} from '@/test-helpers/page-generator';

test.describe('Legal links (non-sagw)', () => {
  beforeEachAcceptCookies();
  test('rendered correctly', {
    tag: '@linking',
  }, async ({
    page,
  }) => {
    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();
    const tenant = await generateTenant({
      name: `tenant-${time}`,
    });

    await generateHomePage({
      navigationTitle: 'home',
      sideTitle: 'Side',
      tenant: tenant.id,
      title: 'Title',
    });

    // #########################################
    // add remainig home data
    // #########################################
    await generateFooterData({
      tenant: tenant.id,
    });

    await generateI18nData({
      tenant: tenant.id,
    });

    await generateConsentData({
      tenant: tenant.id,
    });

    await generateImpressumPage({
      tenant: tenant.id,
    });

    await generateDataPrivacyPage({
      tenant: tenant.id,
    });

    await generateHeaderData({
      tenant: tenant.id,
    });

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
    await page.goto(`http://localhost:3000/de/tenant-${time}`);
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
      .toStrictEqual(`/de/tenant-${time}/data-privacy-de`);

    await expect(linkImpressum)
      .toStrictEqual(`/de/tenant-${time}/impressum-de`);

    // #########################################
    // verify correct url rendering: it
    // #########################################
    await page.goto(`http://localhost:3000/it/tenant-${time}-it`);
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
      .toStrictEqual(`/it/tenant-${time}-it/data-privacy-it`);

    await expect(linkImpressumIt)
      .toStrictEqual(`/it/tenant-${time}-it/impressum-it`);

  });
});
