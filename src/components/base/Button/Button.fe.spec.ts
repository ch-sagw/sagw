import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

test.describe('Button', () => {
  test('should be visible', async ({
    page,
  }) => {

    await navigate(page, 'components-base-button--sample-button');

    const elem = await page.getByTestId('button');

    await expect(elem)
      .toBeVisible();

  });

});
