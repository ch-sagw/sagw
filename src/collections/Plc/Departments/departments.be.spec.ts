import {
  expect,
  test,
} from '@playwright/test';

test.describe('Deparments', () => {
  test('only show content from users department', async ({
    page,
  }) => {
    // test images
    await page.goto('http://localhost:3000/admin/collections/images');
    await page.waitForLoadState('load');

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

    // test publication topic
    await page.goto('http://localhost:3000/admin/collections/publicationTopics');
    await page.waitForLoadState('load');

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

    // test publication type
    await page.goto('http://localhost:3000/admin/collections/publicationTypes');
    await page.waitForLoadState('load');

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

    // test zenodo document
    await page.goto('http://localhost:3000/admin/collections/zenodoDocuments');
    await page.waitForLoadState('load');

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

    // test faq item
    await page.goto('http://localhost:3000/admin/collections/faqItems');
    await page.waitForLoadState('load');

    const expectedFaq = await page.getByText('Question 1 SAGW', {
      exact: true,
    });
    const notExpectedFaq = await page.getByText('Question 1 NOTSAGW', {
      exact: true,
    });

    await expect(expectedFaq)
      .toBeVisible();
    await expect(notExpectedFaq)
      .not.toBeVisible();

    // test home
    const homesRes = await fetch('http://localhost:3000/api/home');
    const homes = await homesRes.json();

    await expect(homes.docs)
      .toHaveLength(1);

    if (homes.docs.length === 1) {
      const [home]: any = homes.docs;
      const [heroTitle] = home.hero.title.root.children[0].children;

      await expect(heroTitle.text)
        .toBe('Home Title SAGW');

    }

    // test news detail page
    await page.goto('http://localhost:3000/admin/collections/newsDetail');
    await page.waitForLoadState('load');
    await page.waitForLoadState('domcontentloaded');

    const expectedNews = await page.getByText('News 1 Title SAGW', {
      exact: true,
    });
    const notExpectedNews = await page.getByText('News 1 Title NOTSAGW', {
      exact: true,
    });

    await expect(expectedNews)
      .toBeVisible();
    await expect(notExpectedNews)
      .not.toBeVisible();

    // test publication detail page
    await page.goto('http://localhost:3000/admin/collections/publicationDetail');
    await page.waitForLoadState('load');

    const expectedPublication = await page.getByText('Publication 1 Title SAGW', {
      exact: true,
    });
    const notExpectedPublication = await page.getByText('Publication 1 Title NOTSAGW', {
      exact: true,
    });

    await expect(expectedPublication)
      .toBeVisible();
    await expect(notExpectedPublication)
      .not.toBeVisible();

  });
});
