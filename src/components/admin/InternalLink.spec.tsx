import {
  expect,
  test,
} from '@playwright/test';

test.describe('PlaceholderTest', () => {
  test('to be successfull', async () => {
    const foo = 'bar';

    await expect(foo)
      .toEqual('bar');

  });

});
