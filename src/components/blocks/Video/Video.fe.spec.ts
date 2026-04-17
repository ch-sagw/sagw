import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

test('expect screenshot', async ({
  page,
}) => {
  await navigate(page, 'components-blocks-video--video-centered');

  await page.context()
    .addCookies([
      {
        name: 'cookie_consent',
        url: 'http://127.0.0.1:6006',
        value: encodeURIComponent(JSON.stringify({
          analytics: true,
          consentGiven: true,
          essential: true,
          external: true,
          timestamp: Date.now(),
        })),
      },
    ]);

  // ensure React picks it up if needed
  await page.evaluate(() => {
    window.dispatchEvent(new Event('consentUpdated'));
  });

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

