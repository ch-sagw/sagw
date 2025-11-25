
import {
  expect,
  test,
} from '@playwright/test';
import { explicitRoleLogin } from '@/test-helpers/payload-login';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

test.describe('can not add images', () => {
  test('translator', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('translator');

      await payload.create({
        collection: 'images',
        data: {
          alt: 'image alt',
          tenant,
        },
        filePath: 'src/seed/test-data/assets/sagw.png',
        overrideAccess: false,
        req: {
          data: {
            tenant,
          },
          user,
        },
      });
    }).rejects.toMatchObject({
      status: 403,
    });

  });
});

test.describe('can not add documents', () => {
  test('translator', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('translator');

      await payload.create({
        collection: 'documents',
        data: {
          date: '2025-10-30',
          tenant,
          title: simpleRteConfig('some doc title'),
        },
        filePath: 'src/seed/test-data/assets/sagw.pdf',
        overrideAccess: false,
        req: {
          data: {
            tenant,
          },
          user,
        },
      });
    }).rejects.toMatchObject({
      status: 403,
    });

  });
});
