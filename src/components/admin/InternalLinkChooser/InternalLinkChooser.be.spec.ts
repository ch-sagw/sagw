import {
  expect,
  test,
} from '@playwright/test';

test.describe('Internal Link Chooser', () => {
  test.beforeEach(async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/');
    await page.waitForLoadState('load');

    const emailInput = await page.getByLabel('E-Mail');

    await expect(emailInput)
      .not.toBeEmpty();

    const loginButton = await page.getByRole('button', {
      name: 'Anmelden',
    });

    await loginButton.click();
    await page.waitForLoadState('networkidle');
  });

  test('shows available links', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/detailPage/create');
    await page.waitForLoadState('networkidle');

    const addContentButton = await page.getByRole('button', {
      name: 'Content hinzufügen',
    });

    await addContentButton.click();

    const linksButton = await page.getByRole('button', {
      name: 'Links',
    });

    await linksButton.click();

    const addLinkButton = await page.getByRole('button', {
      name: 'Link hinzufügen',
    });

    await addLinkButton.click();
    await page.waitForLoadState('networkidle');

    const linkTargetInput = await page.getByLabel('Link Target');

    await linkTargetInput.click();

    const link1 = await page.getByText('Home Page', {
      exact: true,
    });
    const link2 = await page.getByText('Overview page title SAGW', {
      exact: true,
    });
    const link3 = await page.getByText('Detail page title SAGW', {
      exact: true,
    });
    const link4 = await page.getByText('Magazine detail page title SAGW', {
      exact: true,
    });
    const link5 = await page.getByText('Event detail page title SAGW (render link)', {
      exact: true,
    });
    const link6 = await page.getByText('Event detail page title SAGW (render detail page)', {
      exact: true,
    });
    const link7 = await page.getByText('Detail page title SAGW', {
      exact: true,
    });
    const link8 = await page.getByText('News detail page title SAGW', {
      exact: true,
    });
    const link9 = await page.getByText('Publication detail page title SAGW', {
      exact: true,
    });

    await expect(link1)
      .toBeVisible();
    await expect(link2)
      .toBeVisible();
    await expect(link3)
      .toBeVisible();
    await expect(link4)
      .toBeVisible();
    await expect(link5)
      .toBeVisible();
    await expect(link6)
      .toBeVisible();
    await expect(link7)
      .toBeVisible();
    await expect(link8)
      .toBeVisible();
    await expect(link9)
      .toBeVisible();
  });

  test('shows available links in overlay context', async ({
    page,
  }) => {

    await page.goto('http://localhost:3000/admin/collections/detailPage/create');
    await page.waitForLoadState('networkidle');

    const addContentButton = await page.getByRole('button', {
      name: 'Content hinzufügen',
    });

    await addContentButton.click();

    const rteButton = await page.getByRole('button', {
      name: 'Richtext',
    });

    await rteButton.click();

    const rteField = await page.locator('#field-content .ContentEditable__root');

    await rteField.fill('foo');
    await rteField.selectText();

    const linkButton = await page.locator('#field-content .toolbar-popup__button-link');

    await linkButton.click();
    await page.waitForLoadState('networkidle');

    const linkTargetInput = await page.getByLabel('Link Target');

    await linkTargetInput.click();

    const link1 = await page.getByText('Home Page', {
      exact: true,
    });
    const link2 = await page.getByText('Overview page title SAGW', {
      exact: true,
    });
    const link3 = await page.getByText('Detail page title SAGW', {
      exact: true,
    });
    const link4 = await page.getByText('Magazine detail page title SAGW', {
      exact: true,
    });
    const link5 = await page.getByText('Event detail page title SAGW (render link)', {
      exact: true,
    });
    const link6 = await page.getByText('Event detail page title SAGW (render detail page)', {
      exact: true,
    });
    const link7 = await page.getByText('Detail page title SAGW', {
      exact: true,
    });
    const link8 = await page.getByText('News detail page title SAGW', {
      exact: true,
    });
    const link9 = await page.getByText('Publication detail page title SAGW', {
      exact: true,
    });

    await expect(link1)
      .toBeVisible();
    await expect(link2)
      .toBeVisible();
    await expect(link3)
      .toBeVisible();
    await expect(link4)
      .toBeVisible();
    await expect(link5)
      .toBeVisible();
    await expect(link6)
      .toBeVisible();
    await expect(link7)
      .toBeVisible();
    await expect(link8)
      .toBeVisible();
    await expect(link9)
      .toBeVisible();

  });

  test('only shows link of current tenant', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/detailPage/create');
    await page.waitForLoadState('networkidle');

    const addContentButton = await page.getByRole('button', {
      name: 'Content hinzufügen',
    });

    await addContentButton.click();

    const linksButton = await page.getByRole('button', {
      name: 'Links',
    });

    await linksButton.click();

    const addLinkButton = await page.getByRole('button', {
      name: 'Link hinzufügen',
    });

    await addLinkButton.click();
    await page.waitForLoadState('networkidle');

    const linkTargetInput = await page.getByLabel('Link Target');

    await linkTargetInput.click();

    const link1 = await page.getByText('Overview page title SAGW', {
      exact: true,
    });
    const link2 = await page.getByText('Overview page title NOT-SAGW', {
      exact: true,
    });

    await expect(link1)
      .toBeVisible();
    await expect(link2)
      .not.toBeVisible();
  });
});
