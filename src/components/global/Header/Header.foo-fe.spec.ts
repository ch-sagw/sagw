import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

/*
test('transistions to white on scroll', async ({
  page,
}) => {
  await navigate(page, 'components-global-header--header-dark');
  await page.evaluate(() => window.scrollBy(0, 250));

  await expect(page)
    .toHaveScreenshot({
      animations: 'disabled',
      fullPage: false,
    });
});
*/

test('opens menu', async ({
  page,
}, workerInfo) => {
  await navigate(page, 'components-global-header--header-dark');

  const elem = await page.getByTestId('header');

  if (workerInfo.project.name === 'chromium-400' || workerInfo.project.name === 'chromium-700' || workerInfo.project.name === 'chromium-800') {
    const menuButton = elem.getByTestId('menuButton');

    await menuButton.click();
  } else {
    const secondNavElement = elem.getByTestId('navigationItem')
      .nth(1);
    const navButton = secondNavElement.getByTestId('button')
      .nth(0);

    await navButton.hover();
  }

  await expect(page)
    .toHaveScreenshot({
      animations: 'disabled',
      fullPage: false,
    });
});

test('hides menu', async ({
  page,
}, workerInfo) => {
  await navigate(page, 'components-global-header--header-dark');

  const elem = await page.getByTestId('header');

  if (workerInfo.project.name === 'chromium-400' || workerInfo.project.name === 'chromium-700' || workerInfo.project.name === 'chromium-800') {
    const menuButton = elem.getByTestId('menuButton');

    await menuButton.click();
    await (await elem.elementHandle())?.waitForElementState('stable');
    await menuButton.click();
    await (await elem.elementHandle())?.waitForElementState('stable');
  } else {
    const secondNavElement = elem.getByTestId('navigationItem')
      .nth(1);
    const navButton = secondNavElement.getByTestId('button')
      .nth(0);

    await navButton.hover();
    await (await elem.elementHandle())?.waitForElementState('stable');
    await page.keyboard.press('Escape');
    await (await elem.elementHandle())?.waitForElementState('stable');
  }

  await expect(page)
    .toHaveScreenshot({
      animations: 'disabled',
      fullPage: false,
    });
});
