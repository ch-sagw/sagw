import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

test('component should be visible', async ({
  page,
}) => {
  // Put the story name in here. Get it from the url in storybook...
  await navigate(page, 'components-base-image--sample-story');

  const elem = await page.getByText('some text');

  await expect(elem)
    .toBeVisible();
});
