import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

test('correctly opens accordion', async ({
  page,
}) => {
  await navigate(page, 'components-blocks-accordion--background-white');

  const elem = await page.getByTestId('accordion');
  const button = await elem.getByTestId('button')
    .nth(1);
  const content = await elem.getByTestId('content')
    .nth(1);

  await button.click();

  await expect(content)
    .toBeVisible();

  // TODO: icon results in tiny pixel diff in github actions.
  // find stable solution.
  await page.addStyleTag({
    content: `
    #component svg {
      display: none !important;
    }
  `,
  });

  await expect(page)
    .toHaveScreenshot({
      animations: 'disabled',
      fullPage: true,
    });
});

test('closes accordion on escape key', async ({
  page,
}) => {
  await navigate(page, 'components-blocks-accordion--background-white');

  const elem = await page.getByTestId('accordion');
  const button = await elem.getByTestId('button')
    .nth(1);
  const content = await elem.getByTestId('content')
    .nth(1);

  await button.click();

  await page.keyboard.press('Escape');

  await expect(content)
    .not.toBeVisible();

  // TODO: icon results in tiny pixel diff in github actions.
  // find stable solution.
  await page.addStyleTag({
    content: `
    #component svg {
      display: none !important;
    }
  `,
  });

  await expect(page)
    .toHaveScreenshot({
      animations: 'disabled',
      fullPage: true,
    });
});
