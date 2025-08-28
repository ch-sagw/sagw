import {
  expect,
  test,
} from '@playwright/test';

test.describe('Softhyphen', () => {
  test('correctly displays in rte field', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/institutes/create');
    await page.waitForLoadState('load');

    const leadField = await page.locator('#field-hero .ContentEditable__root');
    const hyphenButton = await page.locator('#field-hero .toolbar-popup__button-softHyphenButton');

    await leadField.fill('foo');
    await hyphenButton.click();
    await leadField.fill('bar');

    // fill other fields
    const teaserIinput = await page.getByRole('textbox', {
      name: 'Teaser Link Text',
    });

    await teaserIinput.fill('foo');

    // save
    const saveButton = await page.getByRole('button', {
      name: 'Speichern',
    });

    await saveButton.click();

    // wait for confirmation toast and close it
    const closeToast = await page.locator('.payload-toast-container [data-close-button="true"]');

    await closeToast.click();

    // wait for refresh
    await page.getByRole('heading', {
      name: 'Institutes Page',
    });

    await expect(leadField)
      .toHaveScreenshot();
  });

  test('has correct api payload', async () => {
    const res = await fetch('http://localhost:3000/api/institutes');
    const institutes = await res.json();

    if (institutes.docs.length === 1) {
      const [institute]: any = institutes.docs;

      const instituteRes = await fetch(`http://localhost:3000/api/institutes/${institute.id}`);
      const instituteData = await instituteRes.json();
      const [, heroTitle] = instituteData.hero.title.root.children[0].children;

      await expect(heroTitle.text)
        .toBe('\u00AD');

      await expect(heroTitle.type)
        .toBe('unicode-char');
    }

  });
});
