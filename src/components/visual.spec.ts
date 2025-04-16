import {
  expect,
  test,
} from '@playwright/test';
import { IndexEntry } from '@storybook/types';
import {
  filterStories,
  navigate,
} from '@/testing-helpers';

import { componentsConfig } from '@/components/config';

const manifestResponse = await fetch(`${componentsConfig.vrtBaseUrl}/index.json`);
const manifest = await manifestResponse.json();

const visualStories: IndexEntry[] = filterStories(Object.values(manifest.entries) as IndexEntry[]);

visualStories.forEach((story) => {
  test(story.id, async ({
    page,
  }, meta) => {
    await navigate(page, meta.title);

    const elem = await page.getByTestId(componentsConfig.testid);
    const clip = (await elem.boundingBox()) || undefined;
    const fileName = [
      componentsConfig.vrtSnapshotFolder,
      meta.title,
      `${meta.project.name}.png`,
    ];

    await expect(page)
      .toHaveScreenshot(fileName, {
        animations: 'disabled',
        caret: 'hide',
        clip,

        // if true, firefox screenshots will fail... /)
        // omitBackground: true,
      });
  });
});
