import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

test('transistions to white on scroll', async ({
  page,
}) => {
  await navigate(page, 'components-global-header--header-dark');
  await page.evaluate(() => window.scrollBy(0, 250));

  const elem = await page.getByTestId('header');

  await (await elem.elementHandle())?.waitForElementState('stable');

  await expect(page)
    .toHaveScreenshot({
      animations: 'disabled',
      fullPage: false,
    });
});

test('hides metanav on scroll', async ({
  page,
}, workerInfo) => {
  await navigate(page, 'components-global-header--header-dark');
  await page.evaluate(() => window.scrollBy(0, 250));

  const elem = await page.getByTestId('header');

  if (workerInfo.project.name === 'chromium-1100' || workerInfo.project.name === 'chromium-1600' || workerInfo.project.name === 'firefox' || workerInfo.project.name === 'webkit') {
    const metanavElem = await elem.getByText('mySAGW');

    await (await elem.elementHandle())?.waitForElementState('stable');

    await expect(metanavElem).not.toBeInViewport();
  }
});

test('opens menu', async ({
  page,
}, workerInfo) => {
  await navigate(page, 'components-global-header--header-dark');

  const elem = await page.getByTestId('header');

  if (workerInfo.project.name === 'chromium-400' || workerInfo.project.name === 'chromium-700') {
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

  if (workerInfo.project.name === 'chromium-400' || workerInfo.project.name === 'chromium-700') {
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

test('Correctly shows info text for navItem', async ({
  page,
}, workerInfo) => {

  if (workerInfo.project.name === 'chromium-1100' || workerInfo.project.name === 'chromium-1600' || workerInfo.project.name === 'firefox' || workerInfo.project.name === 'webkit') {
    await navigate(page, 'components-global-header--header-dark');

    const elem = await page.getByTestId('header');

    const level1Button = elem.getByTestId('navigationItem')
      .last();

    await level1Button.hover();

    const infoText = elem.getByTestId('infoblock');

    await expect(infoText)
      .toBeVisible();
  }

});

test('Correctly hides info text for navItem', async ({
  page,
}, workerInfo) => {
  if (workerInfo.project.name === 'chromium-1100' || workerInfo.project.name === 'chromium-1600' || workerInfo.project.name === 'firefox' || workerInfo.project.name === 'webkit') {

    await navigate(page, 'components-global-header--header-dark');

    const elem = await page.getByTestId('header');

    const level1Button = elem.getByTestId('navigationItem')
      .last();

    await level1Button.hover();

    const infoText = elem.getByTestId('infoblock');

    await expect(infoText)
      .toBeVisible();
    await page.mouse.move(1050, 150);
    await expect(infoText)
      .not.toBeInViewport();
  }
});
