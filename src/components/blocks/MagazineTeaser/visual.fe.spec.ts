
import {
  expect,
  Page,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

const waitForImagesAndResetScroll = async (page: Page): Promise<void> => {
  const img = page.locator('img');

  if (await img.count() > 0) {
    await page.waitForFunction(() => {
      const elements = document.querySelectorAll('img');

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];

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
};

const visualStories: string[] = [
  'components-blocks-magazineteaser--horizontal',
  'components-blocks-magazineteaser--vertical',
];

visualStories.forEach((storyName: string) => {
  test(`expect screenshot - ${storyName.split('--')
    .pop()}`, async ({
    page,
  }: { page: Page }) => {
    await navigate(page, storyName);
    await waitForImagesAndResetScroll(page);
    await expect(page)
      .toHaveScreenshot({
        fullPage: true,
      });
  });
});
