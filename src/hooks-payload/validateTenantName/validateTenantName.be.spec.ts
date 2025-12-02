import {
  expect,
  test,
} from '@playwright/test';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { extendExpect } from '@/access/test/extendExpect';

extendExpect(expect);

test('throws validation error on malformed tenantn name', async () => {
  await expect(async () => {
    const payload = await getPayload({
      config: configPromise,
    });

    await payload.create({
      collection: 'tenants',
      data: {
        name: `${(new Date())
          .getTime()}-$4`,
        slug: `${new Date()}`,
        title: `${new Date()}`,
      },
      draft: false,
      overrideAccess: true,
    });

  }).rejects.toMatchObject({
    status: 400,
  });
});
