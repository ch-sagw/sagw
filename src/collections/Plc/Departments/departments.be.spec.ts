import {
  expect,
  test,
} from '@playwright/test';

test.describe('Departments only show content from users department', () => {
  test.beforeEach(async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/');
    await page.waitForLoadState('networkidle');

    const emailInput = await page.getByLabel('E-Mail');

    await expect(emailInput)
      .not.toBeEmpty();

    const loginButton = await page.getByRole('button', {
      name: 'Anmelden',
    });

    await loginButton.click();
    await page.waitForLoadState('networkidle');
  });

  test('images', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/images');
    await page.waitForLoadState('networkidle');

    const expectedImage = await page.getByText('sagw.png', {
      exact: true,
    });
    const notExpectedImage = await page.getByText('not-sagw.png', {
      exact: true,
    });

    await expect(expectedImage)
      .toBeVisible();
    await expect(notExpectedImage)
      .not.toBeVisible();
  });

  test('publication topic', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/publicationTopics');
    await page.waitForLoadState('networkidle');

    const expectedTopic = await page.getByText('Publication Topic 1 SAGW', {
      exact: true,
    });
    const notExpectedTopic = await page.getByText('Publication Topic 1 NOTSAGW', {
      exact: true,
    });

    await expect(expectedTopic)
      .toBeVisible();
    await expect(notExpectedTopic)
      .not.toBeVisible();
  });

  test('publication type', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/publicationTypes');
    await page.waitForLoadState('networkidle');

    const expectedType = await page.getByText('Publication Type 1 SAGW', {
      exact: true,
    });
    const notExpectedType = await page.getByText('Publication Type 1 NOTSAGW', {
      exact: true,
    });

    await expect(expectedType)
      .toBeVisible();
    await expect(notExpectedType)
      .not.toBeVisible();
  });

  test('forms', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/forms');
    await page.waitForLoadState('networkidle');

    const expectedForm = await page.getByText('Form SAGW', {
      exact: true,
    });
    const notExpectedForm = await page.getByText('Form NOT-SAGW', {
      exact: true,
    });

    await expect(expectedForm)
      .toBeVisible();
    await expect(notExpectedForm)
      .not.toBeVisible();
  });

  test('zenodo document', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/zenodoDocuments');
    await page.waitForLoadState('networkidle');

    const expectedDocument = await page.getByText('Sample Zenodo Document SAGW', {
      exact: true,
    });
    const notExpectedDocument = await page.getByText('Sample Zenodo Document NOTSAGW', {
      exact: true,
    });

    await expect(expectedDocument)
      .toBeVisible();
    await expect(notExpectedDocument)
      .not.toBeVisible();
  });

  test('home', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/homePage');
    await page.waitForLoadState('networkidle');

    const expectedDocument = await page.getByText('Home Title SAGW', {
      exact: true,
    });
    const notExpectedDocument = await page.getByText('Home Title NOT-SAGW', {
      exact: true,
    });

    await expect(expectedDocument)
      .toBeVisible();
    await expect(notExpectedDocument)
      .not.toBeVisible();
  });

  test('news detail page', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/newsDetailPage');
    await page.waitForLoadState('networkidle');

    const expectedNews = await page.getByText('News detail page title SAGW', {
      exact: true,
    });
    const notExpectedNews = await page.getByText('News detail page title NOTSAGW', {
      exact: true,
    });

    await expect(expectedNews)
      .toBeVisible();
    await expect(notExpectedNews)
      .not.toBeVisible();
  });

  test('publication detail page', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/publicationDetailPage');
    await page.waitForLoadState('networkidle');

    const expectedPublication = await page.getByText('Publication detail page title SAGW', {
      exact: true,
    });
    const notExpectedPublication = await page.getByText('Publication detail page title NOTSAGW', {
      exact: true,
    });

    await expect(expectedPublication)
      .toBeVisible();
    await expect(notExpectedPublication)
      .not.toBeVisible();
  });

});
