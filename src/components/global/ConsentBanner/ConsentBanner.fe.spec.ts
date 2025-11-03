import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

test('expect screenshot', async ({
  page,
}) => {
  await navigate(page, 'components-global-consent-consentbanner--default-banner');

  const viewport = page.viewportSize();

  if (viewport) {
    await page.setViewportSize({
      height: 600,
      width: viewport.width,
    });
  }

  await expect(page)
    .toHaveScreenshot({
      fullPage: true,
    });

});

