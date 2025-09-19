import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

test('correctly opens accordion', async ({
  page,
}) => {
  await navigate(page, 'components-base-accordion--default-accordion');

  const elem = await page.getByTestId('accordion');
  const button = await elem.getByTestId('button')
    .nth(1);
  const content = await elem.getByTestId('content')
    .nth(1);

  await button.click();

  await expect(content)
    .toBeVisible();

  await expect(page)
    .toHaveScreenshot({
      animations: 'disabled',
      fullPage: true,
    });
});
