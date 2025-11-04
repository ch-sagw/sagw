import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

test('expect screenshot', async ({
  page,
}) => {
  await navigate(page, 'components-global-consent-consentoverlay--default-overlay');

  const viewport = page.viewportSize();

  if (viewport) {
    await page.setViewportSize({
      height: 1400,
      width: viewport.width,
    });
  }

  await expect(page)
    .toHaveScreenshot({
      fullPage: true,
    });

});

