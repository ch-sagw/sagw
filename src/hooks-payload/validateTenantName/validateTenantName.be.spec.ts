import {
  expect,
  test,
} from '@playwright/test';
import { extendExpect } from '@/access/test/extendExpect';
import { generateTenant } from '@/test-helpers/tenant-generator';

extendExpect(expect);

test('throws validation error on malformed tenant name', async () => {
  await expect(async () => {
    await generateTenant({
      name: `${(new Date())
        .getTime()}-$a`,
    });

  }).rejects.toMatchObject({
    status: 400,
  });
});
