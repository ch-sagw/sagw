import {
  expect,
  test,
} from '@playwright/test';
import { IndexEntry } from '@storybook/types';
import {
  filterStories,
  navigate,
} from '@/visual-regression-testing/helpers';

import { vrtConfig } from '@/visual-regression-testing/config';

const manifestResponse = await fetch(`${vrtConfig.baseUrl}/index.json`);
const manifest = await manifestResponse.json();

const visualStories: IndexEntry[] = filterStories(Object.values(manifest.entries) as IndexEntry[]);

visualStories.forEach((story) => {
  test(story.id, async ({
    page,
  }, meta) => {
    await navigate(page, meta.title);

    const elem = await page.getByTestId(vrtConfig.testid);
    const clip = (await elem.boundingBox()) || undefined;

    await expect(page)
      .toHaveScreenshot({
        animations: 'disabled',
        caret: 'hide',
        clip,

        // if true, firefox screenshots will fail... /)
        // omitBackground: true,
      });
  });
});
