import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/visual-regression-testing/helpers';

test('button should be visible', async ({
  page,
}) => {
  await navigate(page, 'components-button--small');

  const elem = await page.getByRole('button');

  await expect(elem)
    .toBeVisible();
});
