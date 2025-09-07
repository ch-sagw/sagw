import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

test.describe('Notification', () => {
  test('should be visible', async ({
    page,
  }) => {

    await navigate(page, 'components-blocks-notification--sample-notification');

    const elem = await page.getByTestId('notification');

    await expect(elem)
      .toBeVisible();

  });

});
