/* eslint-disable @typescript-eslint/naming-convention */

import {
  expect,
  test,
} from '@playwright/test';
import { explicitRoleLogin } from '@/test-helpers/payload-login';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

test.describe('can not delete pages', () => {
  test('editor', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('editor');

      const eventPages = await payload.find({
        collection: 'eventDetailPage',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      await payload.delete({
        collection: 'eventDetailPage',
        id: eventPages.docs[0].id,
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

      const eventPages = await payload.find({
        collection: 'eventDetailPage',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      await payload.delete({
        collection: 'eventDetailPage',
        id: eventPages.docs[0].id,
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

test.describe('can not create pages', () => {
  test('translator', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('sagw-admin');

      console.log('TENANT:', tenant, typeof tenant);

      await payload.create({
        collection: 'detailPage',
        data: {
          _status: 'published',
          content: [],
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Detail Page Lead'),
            title: simpleRteConfig(`Detail page ${(new Date())
              .toString()}`),
          },
          navigationTitle: 'Detail Page',
          slug: `detail-page-title-${(new Date()
            .toString())}`,
          tenant,
        },
        draft: false,
        overrideAccess: false,
        req: {
          data: {
            tenant,
          },
          user,
        },
      });

    }).rejects.toMatchObject({
      data: 'foo',
      status: 403,
    });

  });
});
