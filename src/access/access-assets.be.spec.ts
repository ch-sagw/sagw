
import {
  expect,
  test,
} from '@playwright/test';
import { explicitRoleLogin } from '@/test-helpers/payload-login';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { extendExpect } from '@/access/test/extendExpect';
import { beforeEachPrepareData } from '@/test-helpers/prepare-data';

/* eslint-disable max-nested-callbacks */

extendExpect(expect);

test.describe('access-assets', () => {
  beforeEachPrepareData();

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

  test.describe('can add images', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

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
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

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
      })
        .notRejects();

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

  test.describe('can add documents', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

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
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

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
      })
        .notRejects();

    });
  });
});
