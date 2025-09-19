import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

test.describe('Button', () => {
  test('should be visible', async ({
    page,
  }) => {

    await navigate(page, 'components-base-button--button-primary-filled');

    const elem = await page.getByTestId('button');

    await expect(elem)
      .toBeVisible();

  });

});

test.describe('ButtonLink', () => {
  test('should be visible', async ({
    page,
  }) => {

    await navigate(page, 'components-base-button--button-link-primary-filled');

    const elem = await page.getByTestId('link');

    await expect(elem)
      .toBeVisible();

  });

});
