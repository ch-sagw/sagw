import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

test.describe('Input Text', () => {
  test('correctly shows active state', async ({
    page,
  }) => {

    await navigate(page, 'components-base-inputtext--textarea');

    const elem = await page.getByTestId('input-text');
    const input = await elem.locator('textarea');

    await input.fill('Foo bar');

    await expect(page)
      .toHaveScreenshot();

  });

  test('correctly expands textarea', async ({
    page,
  }) => {

    await navigate(page, 'components-base-inputtext--textarea');

    const elem = await page.getByTestId('input-text');
    const input = await elem.locator('textarea');

    await input.fill('Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz Foo Bar Baz');

    await expect(elem)
      .toHaveScreenshot();

  });

});
