
import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

test('expect screenshot', async ({
  page,
}) => {
  await navigate(page, 'components-blocks-publicationsoverview--lots-of-items');

  const img = page.locator('img');

  // Check if image exists on page
  if (await img.count() > 0) {
    await page.waitForFunction(() => {
      const elements = document.querySelectorAll('img');

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];

        // needed for firefox and webkit to trigger lazyload
        el.scrollIntoView({
          behavior: 'instant',
        });

        if (!el || !el.complete || el.naturalWidth <= 0) {
          return false;
        }
      }

      return true;
    });
  }

  await page.evaluate(() => {
    window.scrollTo({
      behavior: 'instant',
      top: 0,
    });
  });

  await expect(page)
    .toHaveScreenshot({
      fullPage: true,
    });

});

