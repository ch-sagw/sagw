import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

test.describe('Checkbox', () => {
  test('correctly checks on click', async ({
    page,
  }) => {

    await navigate(page, 'components-base-checkbox--default-checkbox');

    const elem = await page.getByTestId('checkbox-label');
    const input = await page.getByRole('checkbox');

    await elem.click({
      position: {
        x: 10,
        y: 10,
      },
    });

    await expect(input)
      .toBeChecked();

    await expect(elem)
      .toHaveScreenshot();

  });

});
