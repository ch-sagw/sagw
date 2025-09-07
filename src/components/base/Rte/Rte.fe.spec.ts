import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

test.describe('Rte', () => {
  test('should be visible', async ({
    page,
  }) => {

    await navigate(page, 'components-base-rte--sample-rte-1');

    const elem = await page.getByTestId('component');
    const paragraph = await elem.locator('p');

    await expect(paragraph)
      .toBeVisible();

  });

});
