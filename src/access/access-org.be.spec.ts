
import {
  expect,
  test,
} from '@playwright/test';
import { explicitRoleLogin } from '@/test-helpers/payload-login';

test.describe('can not create tenants', () => {
  test('sagw admin', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('sagw-admin');

      await payload.create({
        collection: 'tenants',
        data: {
          domain: `${(new Date())
            .getTime()}.localhost`,
          name: `${(new Date())
            .getTime()
            .toString()}1`,
          slug: `${(new Date())
            .getTime()
            .toString()}1`,
          title: `${(new Date())
            .getTime()
            .toString()}1`,
        },
        overrideAccess: false,
        req: {
          data: {
            tenant,
          },
          user,
        },
      });
    }).rejects.toMatchObject({
      status: 400,
    });

  });

  test('fg admin', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('fg-admin');

      await payload.create({
        collection: 'tenants',
        data: {
          domain: `${(new Date())
            .getTime()}.localhost`,
          name: `${(new Date())
            .getTime()
            .toString()}1`,
          slug: `${(new Date())
            .getTime()
            .toString()}1`,
          title: `${(new Date())
            .getTime()
            .toString()}1`,
        },
        overrideAccess: false,
        req: {
          data: {
            tenant,
          },
          user,
        },
      });
    }).rejects.toMatchObject({
      status: 400,
    });

  });

  test('editor', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('editor');

      await payload.create({
        collection: 'tenants',
        data: {
          domain: `${(new Date())
            .getTime()}.localhost`,
          name: `${(new Date())
            .getTime()
            .toString()}1`,
          slug: `${(new Date())
            .getTime()
            .toString()}1`,
          title: `${(new Date())
            .getTime()
            .toString()}1`,
        },
        overrideAccess: false,
        req: {
          data: {
            tenant,
          },
          user,
        },
      });
    }).rejects.toMatchObject({
      status: 400,
    });

  });

  test('translator', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('translator');

      await payload.create({
        collection: 'tenants',
        data: {
          domain: `${(new Date())
            .getTime()}.localhost`,
          name: `${(new Date())
            .getTime()
            .toString()}1`,
          slug: `${(new Date())
            .getTime()
            .toString()}1`,
          title: `${(new Date())
            .getTime()
            .toString()}1`,
        },
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

test.describe('can not delete tenants', () => {
  test('sagw admin', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('sagw-admin');

      if (!tenant) {
        throw new Error('No Tenant');
      }

      await payload.delete({
        collection: 'tenants',
        id: tenant,
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

  test('fg admin', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('fg-admin');

      if (!tenant) {
        throw new Error('No Tenant');
      }

      await payload.delete({
        collection: 'tenants',
        id: tenant,
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

  test('editor', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('editor');

      if (!tenant) {
        throw new Error('No Tenant');
      }

      await payload.delete({
        collection: 'tenants',
        id: tenant,
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

      if (!tenant) {
        throw new Error('No Tenant');
      }

      await payload.delete({
        collection: 'tenants',
        id: tenant,
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

test.describe('can not create users', () => {
  test('sagw admin', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('sagw-admin');

      await payload.create({
        collection: 'users',
        data: {
          email: `${(new Date()
            .getTime()
            .toString())}@foo.com`,
          password: '1234',
          roles: ['global-user'],
          username: `${(new Date()
            .getTime()
            .toString())}`,
        },
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

  test('fg admin', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('fg-admin');

      await payload.create({
        collection: 'users',
        data: {
          email: `${(new Date()
            .getTime()
            .toString())}@foo.com`,
          password: '1234',
          roles: ['global-user'],
          username: `${(new Date()
            .getTime()
            .toString())}`,
        },
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

  test('editor', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('editor');

      await payload.create({
        collection: 'users',
        data: {
          email: `${(new Date()
            .getTime()
            .toString())}@foo.com`,
          password: '1234',
          roles: ['global-user'],
          username: `${(new Date()
            .getTime()
            .toString())}`,
        },
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

      await payload.create({
        collection: 'users',
        data: {
          email: `${(new Date()
            .getTime()
            .toString())}@foo.com`,
          password: '1234',
          roles: ['global-user'],
          username: `${(new Date()
            .getTime()
            .toString())}`,
        },
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

test.describe('can not delete users', () => {
  test('sagw admin', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('sagw-admin');

      // get translator user
      const translator = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: 'translator@vorhall.com',
          },
        },
      });

      await payload.delete({
        collection: 'users',
        id: translator.docs[0].id,
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

  test('fg admin', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('fg-admin');

      // get translator user
      const translator = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: 'translator@vorhall.com',
          },
        },
      });

      await payload.delete({
        collection: 'users',
        id: translator.docs[0].id,
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

  test('editor', async () => {
    await expect(async () => {
      const {
        tenant,
        payload,
        user,
      } = await explicitRoleLogin('editor');

      // get translator user
      const translator = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: 'translator@vorhall.com',
          },
        },
      });

      await payload.delete({
        collection: 'users',
        id: translator.docs[0].id,
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

      // get translator user
      const translator = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: 'sagw-admin@vorhall.com',
          },
        },
      });

      await payload.delete({
        collection: 'users',
        id: translator.docs[0].id,
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
