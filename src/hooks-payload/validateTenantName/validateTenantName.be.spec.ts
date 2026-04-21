import {
  expect,
  test,
} from '@playwright/test';
import { extendExpect } from '@/access/test/extendExpect';
import { getPayloadCached } from '@/utilities/getPayloadCached';

extendExpect(expect);

test('throws validation error on malformed tenant name', async () => {
  const payload = await getPayloadCached();
  const time = (new Date())
    .getTime();

  await expect(async () => {
    await payload.create({
      collection: 'tenants',
      context: {
        skipTenantInitialData: true,
      },
      data: {
        faviconName: `favicon-${time}`,
        name: `${time}-$a`,
        slug: `slug-${time}`,
      },
      draft: false,
      overrideAccess: true,
    });
  }).rejects.toMatchObject({
    status: 400,
  });
});
