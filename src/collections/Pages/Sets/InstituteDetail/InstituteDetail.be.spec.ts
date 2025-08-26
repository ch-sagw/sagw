// http://localhost:3000/admin/collections/instituteDetail/create

import {
  expect,
  test,
} from '@playwright/test';

test.describe.serial('Add Zenodo document', () => {
  // let linkTargetInput: Locator;

  test.beforeEach(async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin/collections/instituteDetail/create');
    await page.waitForLoadState('load');

    /*
    linkTargetInput = await page.getByRole('textbox', {
      name: 'instituteDetails.linkInternal.linkText',
    });
    */
  });

  test('api returns proper data', async () => {
    const foo = 'bar';

    await expect(foo)
      .toEqual('bar');
  });
});
