import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

test('component should be visible', async ({
  page,
}) => {
  await navigate(page, 'components-base-inputtext--sample-story');

  const elem = await page.getByTestId('input-text');

  await expect(elem)
    .toBeVisible();
});
