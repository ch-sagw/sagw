
import {
  expect,
  test,
} from '@playwright/test';
import { explicitRoleLogin } from '@/test-helpers/payload-login';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

test.describe('can not change i18n globals', () => {
  test('editor', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('editor');

      const i18n = await payload.find({
        collection: 'i18nGlobals',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      await payload.update({
        collection: 'i18nGlobals',
        data: {
          generic: {
            downloadTitle: simpleRteConfig('foo'),
          },
        },
        id: i18n.docs[0].id,
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

  test('translator', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('translator');

      const i18n = await payload.find({
        collection: 'i18nGlobals',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      await payload.update({
        collection: 'i18nGlobals',
        data: {
          generic: {
            downloadTitle: simpleRteConfig('foo'),
          },
        },
        id: i18n.docs[0].id,
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
