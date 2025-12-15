import {
  expect,
  test,
} from '@playwright/test';
import { IndexEntry } from 'storybook/internal/types';
import {
  filterVisualStories,
  navigate,
} from '@/automated-testing/helpers';

import { vrtConfig } from '@/automated-testing/config';

const manifestResponse = await fetch(`${vrtConfig.baseUrl}/index.json`);
const manifest = await manifestResponse.json();

const visualStories: IndexEntry[] = filterVisualStories(Object.values(manifest.entries) as IndexEntry[]);

visualStories.forEach((story) => {
  test(story.id, async ({
    page,
  }, meta) => {
    await navigate(page, meta.title);

    const elem = await page.getByTestId(vrtConfig.testid);

    await (await elem.elementHandle())?.waitForElementState('stable');

    const head = await page.locator('head #addon-backgrounds-color');
    const body = page.locator('body');

    await expect(body)
      .not.toHaveClass('sb-show-preparing-story');

    await expect(head)
      .toBeAttached();

    await expect(page)
      .toHaveScreenshot({
        animations: 'disabled',
        caret: 'hide',
        fullPage: true,

        // if true, firefox screenshots will fail... /)
        // omitBackground: true,
      });
  });
});
