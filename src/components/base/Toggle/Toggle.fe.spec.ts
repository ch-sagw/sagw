import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

test.describe('Toggle', () => {
  test('correctly shows active state', async ({
    page,
  }) => {

    await navigate(page, 'components-base-toggle--checked');

    const elem = await page.getByTestId('toggle');

    await expect(elem)
      .toHaveScreenshot();

  });
});

test.describe('Toggle', () => {
  test('correctly shows inactive state', async ({
    page,
  }) => {

    await navigate(page, 'components-base-toggle--unchecked');

    const elem = await page.getByTestId('toggle');

    await expect(elem)
      .toHaveScreenshot();

  });
});
