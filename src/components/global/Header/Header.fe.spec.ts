import {
  expect,
  type Locator,
  test,
} from '@playwright/test';
import { navigate } from '@/automated-testing/helpers';

// --- Scroll interaction

test('transitions to white on scroll', async ({
  page,
}, workerInfo) => {
  // webkit is flaky on this test, so exclude it
  if (workerInfo.project.name !== 'webkit') {
    await navigate(page, 'components-global-header--header-dark');
    await page.evaluate(() => window.scrollBy(0, 250));

    const elem = await page.getByTestId('header');

    await (await elem.elementHandle())?.waitForElementState('stable');

    await expect(page)
      .toHaveScreenshot({
        animations: 'disabled',
        fullPage: false,
      });
  }

});

test('hides metanav on scroll', async ({
  page,
}, workerInfo) => {
  if (workerInfo.project.name === 'chromium-1100' || workerInfo.project.name === 'chromium-1600' || workerInfo.project.name === 'firefox' || workerInfo.project.name === 'webkit') {
    await navigate(page, 'components-global-header--header-dark');
    await page.evaluate(() => window.scrollBy(0, 250));

    const elem = await page.getByTestId('header');
    const metanavElem = await elem.getByText('mySAGW');

    await (await elem.elementHandle())?.waitForElementState('stable');
    await expect(metanavElem).not.toBeInViewport();
  }
});

// --- Mouse interaction

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

// --- Info Text

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

    await page.mouse.move(1500, 350);

    await expect(infoText)
      .not.toBeVisible();
  }
});

// --- LangNav dependency on the main menu

test('Correctly shows lang menu if nav has only 1 level', async ({
  page,
}, workerInfo) => {
  if (workerInfo.project.name === 'chromium-1100' || workerInfo.project.name === 'chromium-1600' || workerInfo.project.name === 'firefox' || workerInfo.project.name === 'webkit') {

    const viewport = page.viewportSize();

    if (viewport) {
      await page.setViewportSize({
        height: 600,
        width: viewport.width,
      });
    }

    await navigate(page, 'components-global-header--header-without-level-2');

    const elem = await page.getByTestId('header');

    const langNav = await elem.getByTestId('langnav')
      .last();

    await langNav.hover();

    const langNavDe = await langNav.getByTestId('de');
    const langNavFr = await langNav.getByTestId('fr');
    const langNavEn = await langNav.getByTestId('en');
    const langNavIt = await langNav.getByTestId('it');

    await expect(langNavDe)
      .toBeInViewport();
    await expect(langNavFr)
      .toBeInViewport();
    await expect(langNavEn)
      .toBeInViewport();
    await expect(langNavIt)
      .toBeInViewport();
  }
});

// --- Helpers for the expandable sub-navigations (NavigationItem, Langnav)
//
// At desktop widths the collapsed list is `position: absolute` with
// `opacity: 0` and `inert`; the links keep their box and are not clipped
// by their own container. Playwright's toBeVisible() ignores opacity and
// toBeInViewport() only reflects clipping, so neither proves "hidden".
// We therefore assert what actually hides/shows the list: the wrapper's
// computed opacity, the inert attribute, and (when open) that the first
// link really is on screen.

const expandableWrapper = (container: Locator): Locator => container.locator('ul')
  .first()
  .locator('..');

const expectSubnavOpen = async (container: Locator): Promise<void> => {
  const wrapper = expandableWrapper(container);

  await expect(wrapper)
    .toHaveCSS('opacity', '1');
  await expect(wrapper)
    .not.toHaveAttribute('inert', '');
  await expect(container.getByTestId('link')
    .first())
    .toBeInViewport();
};

const expectSubnavClosed = async (container: Locator): Promise<void> => {
  const wrapper = expandableWrapper(container);

  await expect(wrapper)
    .toHaveCSS('opacity', '0');
  await expect(wrapper)
    .toHaveAttribute('inert', '');
};

// --- Desktop nav interaction: keyboard

test.describe('desktop nav keyboard interaction', () => {
  test.skip(({
    viewport,
  }) => (viewport?.width ?? 0) < 1024, 'desktop only');

  test('Enter opens and closes a level-1 item', async ({
    page,
  }) => {
    await navigate(page, 'components-global-header--header-dark');

    const header = page.getByTestId('header');
    const items = header.getByTestId('navigationItem');
    const item = items.nth(1);
    const button = item.getByTestId('button')
      .first();
    const firstSubLink = item.getByRole('link')
      .first();
    const nextLevel1Button = items.nth(2)
      .getByTestId('button')
      .first();

    await expectSubnavClosed(item);

    await button.focus();
    await page.keyboard.press('Enter');

    await expect(button)
      .toHaveAttribute('aria-expanded', 'true');
    await expect(header.getByTestId('infoblock'))
      .toBeVisible();
    await expectSubnavOpen(item);

    // open: Tab moves into the sub-navigation (not inert)
    await page.keyboard.press('Tab');

    await expect(firstSubLink)
      .toBeFocused();

    // focus stays inside the item, so moving back must not close it
    await page.keyboard.press('Shift+Tab');

    await expect(button)
      .toBeFocused();
    await expect(button)
      .toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Enter');

    await expect(button)
      .toHaveAttribute('aria-expanded', 'false');
    await expectSubnavClosed(item);

    // closed: Tab skips the inert sub-navigation and lands on the next item
    await page.keyboard.press('Tab');

    await expect(nextLevel1Button)
      .toBeFocused();
  });

  test('Escape closes a level-1 item opened via keyboard', async ({
    page,
  }) => {
    await navigate(page, 'components-global-header--header-dark');

    const button = page.getByTestId('header')
      .getByTestId('navigationItem')
      .nth(1)
      .getByTestId('button')
      .first();

    await button.focus();
    await page.keyboard.press('Enter');

    await expect(button)
      .toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');

    await expect(button)
      .toHaveAttribute('aria-expanded', 'false');
  });

  test('mouse click on hovered item keeps it open', async ({
    page,
  }) => {
    await navigate(page, 'components-global-header--header-dark');

    const button = page.getByTestId('header')
      .getByTestId('navigationItem')
      .nth(1)
      .getByTestId('button')
      .first();

    await button.hover();

    await expect(button)
      .toHaveAttribute('aria-expanded', 'true');

    await button.click();

    await expect(button)
      .toHaveAttribute('aria-expanded', 'true');
  });
});

// --- Desktop nav interaction: touch devices. Touch emulation is only verified
// in chromium projects.

test.describe('desktop nav touch interaction', () => {
  test.skip(({
    viewport, browserName,
  }) => (viewport?.width ?? 0) < 1024 || browserName !== 'chromium', 'desktop chromium only');

  test.use({
    hasTouch: true,
  });

  test('hover still works when the device has touch capabilities', async ({
    page,
  }) => {
    await navigate(page, 'components-global-header--header-dark');

    const button = page.getByTestId('header')
      .getByTestId('navigationItem')
      .nth(1)
      .getByTestId('button')
      .first();

    await button.hover();

    await expect(button)
      .toHaveAttribute('aria-expanded', 'true');
  });

  test('tap opens, tap again closes, tap on sibling switches', async ({
    page,
  }) => {
    await navigate(page, 'components-global-header--header-dark');

    const items = page.getByTestId('header')
      .getByTestId('navigationItem');
    const item1 = items.nth(1);
    const item2 = items.last();
    const button1 = item1.getByTestId('button')
      .first();
    const button2 = item2.getByTestId('button')
      .first();

    await expectSubnavClosed(item1);

    await button1.tap();

    await expect(button1)
      .toHaveAttribute('aria-expanded', 'true');
    await expectSubnavOpen(item1);

    await button1.tap();

    await expect(button1)
      .toHaveAttribute('aria-expanded', 'false');
    await expectSubnavClosed(item1);

    await button1.tap();

    await expect(button1)
      .toHaveAttribute('aria-expanded', 'true');
    await expectSubnavOpen(item1);

    await button2.tap();

    await expect(button2)
      .toHaveAttribute('aria-expanded', 'true');
    await expectSubnavOpen(item2);
    await expect(button1)
      .toHaveAttribute('aria-expanded', 'false');
    await expectSubnavClosed(item1);
  });

  test('tap outside collapses the header', async ({
    page,
  }) => {
    // The expanded header is taller than the default 300px test viewport;
    // make room so that there is page area outside the header to tap on.
    const viewport = page.viewportSize();

    if (viewport) {
      await page.setViewportSize({
        height: 800,
        width: viewport.width,
      });
    }

    await navigate(page, 'components-global-header--header-dark');

    const header = page.getByTestId('header');
    const item = header.getByTestId('navigationItem')
      .nth(1);
    const button = item.getByTestId('button')
      .first();
    const subLinks = item.getByTestId('link');

    await button.tap();

    await expect(button)
      .toHaveAttribute('aria-expanded', 'true');
    await expectSubnavOpen(item);

    // with enough viewport height, every sub-link must be fully on screen
    // and not clipped by the header
    const subLinkCount = await subLinks.count();

    expect(subLinkCount)
      .toBeGreaterThan(0);

    await Promise.all(Array.from({
      length: subLinkCount,
    }, (_, i) => expect(subLinks.nth(i))
      .toBeInViewport({
        ratio: 1,
      })));

    const headerBox = await header.boundingBox();

    await page.touchscreen.tap(10, (headerBox?.y ?? 0) + (headerBox?.height ?? 0) + 40);

    await expect(button)
      .toHaveAttribute('aria-expanded', 'false');
    await expectSubnavClosed(item);
    await expect(header.getByTestId('infoblock'))
      .not.toBeVisible();
  });

  test('langnav: tap opens, tap again closes', async ({
    page,
  }) => {
    await navigate(page, 'components-global-header--header-dark');

    const langnav = page.getByTestId('langnav');
    const toggle = langnav.getByTestId('button')
      .first();

    await expectSubnavClosed(langnav);

    await toggle.tap();

    await expect(toggle)
      .toHaveAttribute('aria-expanded', 'true');
    await expectSubnavOpen(langnav);

    await toggle.tap();

    await expect(toggle)
      .toHaveAttribute('aria-expanded', 'false');
    await expectSubnavClosed(langnav);
  });
});
