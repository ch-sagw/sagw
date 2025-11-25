/* eslint-disable @typescript-eslint/naming-convention */

import {
  expect,
  test,
} from '@playwright/test';
import { explicitRoleLogin } from '@/test-helpers/payload-login';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { extendExpect } from '@/access/test/extendExpect';

extendExpect(expect);

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

test.describe('can delete pages', () => {
  test('sagw-admin', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('sagw-admin');

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
    })
      .notRejects();

  });

});

test.describe('can not create pages', () => {
  test('translator', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('translator');

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
      status: 403,
    });

  });
});

test.describe('can create pages', () => {
  test('sagw-admin', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('sagw-admin');

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
            .toString())}1`,
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
            .toString())}2`,
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

    })
      .notRejects();

  });

  test('editor', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('editor');

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
            .toString())}3`,
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

    })
      .notRejects();

  });
});

test.describe('can not publish pages', () => {
  test('translator', async () => {

    await expect(async () => {
      // create draft page as sagw-admin
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('sagw-admin');

      const detailPage = await payload.create({
        collection: 'detailPage',
        data: {
          _status: 'draft',
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Overview Page Lead'),
            title: simpleRteConfig('Overview page title'),
          },
          navigationTitle: 'Detail Page',
          slug: `detail-page-title-${(new Date())
            .toString()}`,
          tenant,
        },
        overrideAccess: false,
        req: {
          data: {
            tenant,
          },
          user,
        },
      });

      // publish page as translator
      const {
        tenant: translatorTenant,
        payload: translatorPayload,
        user: translatorUser,
      } = await explicitRoleLogin('translator');

      const upt = await translatorPayload.update({
        collection: 'detailPage',
        data: {
          _status: 'published',
        },
        id: detailPage.id,
        overrideAccess: false,
        req: {
          data: {
            tenant: translatorTenant,
          },
          user: translatorUser,
        },
      });

      console.log(upt);

    }).rejects.toMatchObject({
      status: 400,
    });

  });
});

test.describe('can publish pages', () => {
  test('editor', async () => {

    await expect(async () => {
      // create draft page as sagw-admin
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('sagw-admin');

      const detailPage = await payload.create({
        collection: 'detailPage',
        data: {
          _status: 'draft',
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Overview Page Lead'),
            title: simpleRteConfig('Overview page title'),
          },
          navigationTitle: 'Detail Page',
          slug: `detail-page-title-${(new Date())
            .toString()}41`,
          tenant,
        },
        overrideAccess: false,
        req: {
          data: {
            tenant,
          },
          user,
        },
      });

      // publish page as editor
      const {
        tenant: translatorTenant,
        payload: translatorPayload,
        user: translatorUser,
      } = await explicitRoleLogin('editor');

      await translatorPayload.update({
        collection: 'detailPage',
        data: {
          _status: 'published',
        },
        id: detailPage.id,
        overrideAccess: false,
        req: {
          data: {
            tenant: translatorTenant,
          },
          user: translatorUser,
        },
      });

    })
      .notRejects();

  });

  test('fg-admin', async () => {

    await expect(async () => {
      // create draft page as fg-admin
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('fg-admin');

      const detailPage = await payload.create({
        collection: 'detailPage',
        data: {
          _status: 'draft',
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Overview Page Lead'),
            title: simpleRteConfig('Overview page title'),
          },
          navigationTitle: 'Detail Page',
          slug: `detail-page-title-${(new Date())
            .toString()}42`,
          tenant,
        },
        overrideAccess: false,
        req: {
          data: {
            tenant,
          },
          user,
        },
      });

      await payload.update({
        collection: 'detailPage',
        data: {
          _status: 'published',
        },
        id: detailPage.id,
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
      // create draft page as sagw-admin
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('sagw-admin');

      const detailPage = await payload.create({
        collection: 'detailPage',
        data: {
          _status: 'draft',
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Overview Page Lead'),
            title: simpleRteConfig('Overview page title'),
          },
          navigationTitle: 'Detail Page',
          slug: `detail-page-title-${(new Date())
            .toString()}43`,
          tenant,
        },
        overrideAccess: false,
        req: {
          data: {
            tenant,
          },
          user,
        },
      });

      // publish page as fg-admin
      const {
        tenant: translatorTenant,
        payload: translatorPayload,
        user: translatorUser,
      } = await explicitRoleLogin('sagw-admin');

      await translatorPayload.update({
        collection: 'detailPage',
        data: {
          _status: 'published',
        },
        id: detailPage.id,
        overrideAccess: false,
        req: {
          data: {
            tenant: translatorTenant,
          },
          user: translatorUser,
        },
      });

    })
      .notRejects();

  });
});

test.describe('can not add blocks', () => {
  test('translator', async () => {

    await expect(async () => {
      // create a page as sagw-admin
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('sagw-admin');

      const detailPage = await payload.create({
        collection: 'detailPage',
        data: {
          _status: 'published',
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Overview Page Lead'),
            title: simpleRteConfig('Overview page title'),
          },
          navigationTitle: 'Detail Page',
          slug: `detail-page-title-${(new Date())
            .toString()}-1`,
          tenant,
        },
        overrideAccess: false,
        req: {
          data: {
            tenant,
          },
          user,
        },
      });

      // update page as translator with blocks
      const {
        tenant: translatorTenant,
        payload: translatorPayload,
        user: translatorUser,
      } = await explicitRoleLogin('translator');

      await translatorPayload.update({
        collection: 'detailPage',
        data: {
          content: [
            // cta contact
            {
              blockType: 'notificationBlock',
              text: simpleRteConfig('foo'),
            },
          ],
        },
        id: detailPage.id,
        overrideAccess: false,
        req: {
          data: {
            tenant: translatorTenant,
          },
          user: translatorUser,
        },
      });

    }).rejects.toBeDefined();

  });
});

test.describe('can add blocks', () => {
  test('editor', async () => {

    await expect(async () => {
      // create a page as sagw-admin
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('sagw-admin');

      const detailPage = await payload.create({
        collection: 'detailPage',
        data: {
          _status: 'published',
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Overview Page Lead'),
            title: simpleRteConfig('Overview page title'),
          },
          navigationTitle: 'Detail Page',
          slug: `detail-page-title-${(new Date())
            .toString()}-11`,
          tenant,
        },
        overrideAccess: false,
        req: {
          data: {
            tenant,
          },
          user,
        },
      });

      // update page as translator with blocks
      const {
        tenant: translatorTenant,
        payload: translatorPayload,
        user: translatorUser,
      } = await explicitRoleLogin('editor');

      await translatorPayload.update({
        collection: 'detailPage',
        data: {
          content: [
            // cta contact
            {
              blockType: 'notificationBlock',
              text: simpleRteConfig('foo'),
            },
          ],
        },
        id: detailPage.id,
        overrideAccess: false,
        req: {
          data: {
            tenant: translatorTenant,
          },
          user: translatorUser,
        },
      });

    })
      .notRejects();

  });

  test('sagw-admin', async () => {

    await expect(async () => {
      // create a page as sagw-admin
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('sagw-admin');

      const detailPage = await payload.create({
        collection: 'detailPage',
        data: {
          _status: 'published',
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Overview Page Lead'),
            title: simpleRteConfig('Overview page title'),
          },
          navigationTitle: 'Detail Page',
          slug: `detail-page-title-${(new Date())
            .toString()}-12`,
          tenant,
        },
        overrideAccess: false,
        req: {
          data: {
            tenant,
          },
          user,
        },
      });

      await payload.update({
        collection: 'detailPage',
        data: {
          content: [
            // cta contact
            {
              blockType: 'notificationBlock',
              text: simpleRteConfig('foo'),
            },
          ],
        },
        id: detailPage.id,
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

      const detailPage = await payload.create({
        collection: 'detailPage',
        data: {
          _status: 'published',
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Overview Page Lead'),
            title: simpleRteConfig('Overview page title'),
          },
          navigationTitle: 'Detail Page',
          slug: `detail-page-title-${(new Date())
            .toString()}-13`,
          tenant,
        },
        overrideAccess: false,
        req: {
          data: {
            tenant,
          },
          user,
        },
      });

      await payload.update({
        collection: 'detailPage',
        data: {
          content: [
            // cta contact
            {
              blockType: 'notificationBlock',
              text: simpleRteConfig('foo'),
            },
          ],
        },
        id: detailPage.id,
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

test.describe('can not delete blocks', () => {
  test('translator', async () => {

    await expect(async () => {
      // create a page as sagw-admin
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('sagw-admin');

      const detailPage = await payload.create({
        collection: 'detailPage',
        data: {
          _status: 'published',
          content: [
            // cta contact
            {
              blockType: 'notificationBlock',
              text: simpleRteConfig('foo'),
            },
          ],
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Overview Page Lead'),
            title: simpleRteConfig('Overview page title'),
          },
          navigationTitle: 'Detail Page',
          slug: `detail-page-title-${(new Date())
            .toString()}-1`,
          tenant,
        },
        overrideAccess: false,
        req: {
          data: {
            tenant,
          },
          user,
        },
      });

      // update page as translator with blocks
      const {
        tenant: translatorTenant,
        payload: translatorPayload,
        user: translatorUser,
      } = await explicitRoleLogin('translator');

      await translatorPayload.update({
        collection: 'detailPage',
        data: {
          content: [],
        },
        id: detailPage.id,
        overrideAccess: false,
        req: {
          data: {
            tenant: translatorTenant,
          },
          user: translatorUser,
        },
      });

    }).rejects.toMatchObject({
      status: 400,
    });

  });
});

test.describe('can delete blocks', () => {
  test('editor', async () => {

    await expect(async () => {
      // create a page as sagw-admin
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('sagw-admin');

      const detailPage = await payload.create({
        collection: 'detailPage',
        data: {
          _status: 'published',
          content: [
            // cta contact
            {
              blockType: 'notificationBlock',
              text: simpleRteConfig('foo'),
            },
          ],
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Overview Page Lead'),
            title: simpleRteConfig('Overview page title'),
          },
          navigationTitle: 'Detail Page',
          slug: `detail-page-title-${(new Date())
            .toString()}-21`,
          tenant,
        },
        overrideAccess: false,
        req: {
          data: {
            tenant,
          },
          user,
        },
      });

      // update page as translator with blocks
      const {
        tenant: translatorTenant,
        payload: translatorPayload,
        user: translatorUser,
      } = await explicitRoleLogin('editor');

      await translatorPayload.update({
        collection: 'detailPage',
        data: {
          content: [],
        },
        id: detailPage.id,
        overrideAccess: false,
        req: {
          data: {
            tenant: translatorTenant,
          },
          user: translatorUser,
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

      const detailPage = await payload.create({
        collection: 'detailPage',
        data: {
          _status: 'published',
          content: [
            // cta contact
            {
              blockType: 'notificationBlock',
              text: simpleRteConfig('foo'),
            },
          ],
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Overview Page Lead'),
            title: simpleRteConfig('Overview page title'),
          },
          navigationTitle: 'Detail Page',
          slug: `detail-page-title-${(new Date())
            .toString()}-22`,
          tenant,
        },
        overrideAccess: false,
        req: {
          data: {
            tenant,
          },
          user,
        },
      });

      await payload.update({
        collection: 'detailPage',
        data: {
          content: [],
        },
        id: detailPage.id,
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

      const detailPage = await payload.create({
        collection: 'detailPage',
        data: {
          _status: 'published',
          content: [
            // cta contact
            {
              blockType: 'notificationBlock',
              text: simpleRteConfig('foo'),
            },
          ],
          hero: {
            colorMode: 'white',
            lead: simpleRteConfig('Overview Page Lead'),
            title: simpleRteConfig('Overview page title'),
          },
          navigationTitle: 'Detail Page',
          slug: `detail-page-title-${(new Date())
            .toString()}-23`,
          tenant,
        },
        overrideAccess: false,
        req: {
          data: {
            tenant,
          },
          user,
        },
      });

      await payload.update({
        collection: 'detailPage',
        data: {
          content: [],
        },
        id: detailPage.id,
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
