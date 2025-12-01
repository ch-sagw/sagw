import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

test('expect screenshot', async ({
  page,
}) => {
  await navigate(page, 'components-blocks-video--video-centered');

  const viewport = page.viewportSize();

  const img = page.locator('img');

  // Check if image exists on page
  if (await img.count() > 0) {
    await page.waitForFunction(() => {
      const el = document.querySelector('img');

      return el && el.complete && el.naturalWidth > 0;
    });
  }

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

