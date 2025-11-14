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

  // for await (const story of a11yStories) {
  a11yStories.forEach((story) => {
    test(story.id, async ({
      page,
    }, meta) => {
      await navigate(page, meta.title);

      const elem = await page.getByTestId(vrtConfig.testid);

      await (await elem.elementHandle())?.waitForElementState('stable');
      await page.locator(`#${vrtConfig.testid}`)
        .waitFor();

      const head = await page.locator('head #addon-backgrounds-color');
      const body = page.locator('body');

      await expect(body)
        .not.toHaveClass('sb-show-preparing-story');

      await expect(head)
        .toBeAttached();

      const accessibilityScanResults = await new Axe({
        page,
      })
        .include(`#${vrtConfig.testid}`)

        // exclude these, since <li> is root is invalid. they will be tested
        // in the list-component anyway, and within the correct context.
        .exclude('[data-testid="eventListItem"]')
        .exclude('[data-testid="newsListItem"]')
        .exclude('[data-testid="downloadLinkItem"]')
        .exclude('[data-testid="publicationListItem"]')
        .analyze();

      expect(accessibilityScanResults.violations)
        .toEqual([]);
    });
  });

} catch (err) {
  console.log(err);
}

