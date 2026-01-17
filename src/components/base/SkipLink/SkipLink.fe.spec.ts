import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

test('component should be visible', async ({
  page,
}) => {
  await navigate(page, 'components-base-skiplink--skip-to-main-content');

  const elem = await page.locator('a[href="#content"]');

  await elem.focus();

  await expect(elem)
    .toBeVisible();
});
