import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

test.describe('Rte', () => {
  test('should be visible', async ({
    page,
  }) => {

    await navigate(page, 'components-base-rte--rte-1-hero-lead');

    const elem = await page.getByTestId('component');
    const paragraph = await elem.locator('p');

    await expect(paragraph)
      .toBeVisible();

  });

});
