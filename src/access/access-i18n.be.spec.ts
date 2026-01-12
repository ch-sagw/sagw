
import {
  expect,
  test,
} from '@playwright/test';
import { explicitRoleLogin } from '@/test-helpers/payload-login';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { extendExpect } from '@/access/test/extendExpect';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';

extendExpect(expect);

test.describe('can not change i18n globals', () => {
  test.beforeEach(async () => {

    // delete data
    await deleteSetsPages();
    await deleteOtherCollections();
  });

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

test.describe('can change i18n globals', () => {
  test.beforeEach(async () => {

    // delete data
    await deleteSetsPages();
    await deleteOtherCollections();
  });

  test('sagw-admin', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('sagw-admin');

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
    })
      .notRejects();

  });

  test('fg-admin', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('fg-admin');

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
    })
      .notRejects();

  });

});
