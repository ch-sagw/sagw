import {
  expect,
  test,
} from '@playwright/test';
import Axe from '@axe-core/playwright';
import { IndexEntry } from 'storybook/internal/types';

import {
  filterA11yStories,
  navigate,
} from '@/automated-testing/helpers';
import { vrtConfig } from '@/automated-testing/config';

try {
  const manifestResponse = await fetch(`${vrtConfig.baseUrl}/index.json`);
  const manifest = await manifestResponse.json();

  const a11yStories: IndexEntry[] = filterA11yStories(Object.values(manifest.entries) as IndexEntry[]);

  a11yStories.forEach((story) => {
    test(story.id, async ({
      page,
    }, meta) => {
      await navigate(page, meta.title);

      const elem = await page.getByTestId(vrtConfig.testid);

      await (await elem.elementHandle())?.waitForElementState('stable');
      await page.locator(`#${vrtConfig.testid}`)
        .waitFor();

      const accessibilityScanResults = await new Axe({
        page,
      })
        .include(`#${vrtConfig.testid}`)
        .analyze();

      expect(accessibilityScanResults.violations)
        .toEqual([]);
    });
  });

} catch (err) {
  console.log(err);
}

