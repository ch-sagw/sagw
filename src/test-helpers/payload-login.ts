import { test } from '@playwright/test';
import { Payload } from 'payload';
import {
  HomePage, User,
} from '@/payload-types';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

export const beforeEachPayloadLogin = (): void => {
  test.beforeEach(async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/admin');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('load');

    await page.waitForFunction('document.cookie.includes(\'payload-tenant\')');
  });
};

interface InterfaceExplicitRoleLoginReturn {
  home: HomePage;
  payload: Payload;
  user: User & { collection: 'users'; };
  tenant?: string;
}

export const explicitRoleLogin = async (type: 'super-admin' | 'sagw-admin' | 'fg-admin' | 'editor' | 'translator'): Promise<InterfaceExplicitRoleLoginReturn> => {
  const payload = await getPayloadCached();

  let email;
  let password;

  if (type === 'super-admin') {
    email = process.env.USER_SUPER_ADMIN_MAIL;
    password = process.env.USER_SUPER_ADMIN_PASS;
  } else if (type === 'sagw-admin') {
    email = process.env.USER_SAGW_ADMIN_MAIL;
    password = process.env.USER_SAGW_ADMIN_PASS;
  } else if (type === 'fg-admin') {
    email = process.env.USER_FG_ADMIN_MAIL;
    password = process.env.USER_FG_ADMIN_PASS;
  } else if (type === 'editor') {
    email = process.env.USER_MAGAZINE_EDITOR_MAIL;
    password = process.env.USER_MAGAZINE_EDITOR_PASS;
  } else if (type === 'translator') {
    email = process.env.USER_TRANSLATOR_MAIL;
    password = process.env.USER_TRANSLATOR_PASS;
  }

  if (!email || !password) {
    throw new Error('No login credentials');
  }

  const {
    user,
  } = await payload.login({
    collection: 'users',
    data: {
      email,
      password,
    },
  });

  let tenant;

  if (type !== 'super-admin') {
    tenant = user.tenants?.[0]?.tenant;

    if (!tenant || typeof tenant !== 'string') {
      throw new Error('User has no tenant');
    }
  }

  let home: HomePage;

  const homeDocs = await payload.find({
    collection: 'homePage',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  if (homeDocs.docs.length < 1) {
    home = await payload.create({
      collection: 'homePage',
      data: {
        /* eslint-disable @typescript-eslint/naming-convention */
        _status: 'published',
        /* eslint-enable @typescript-eslint/naming-convention */
        hero: {
          sideTitle: simpleRteConfig('home side'),
          title: simpleRteConfig('home'),
        },
        tenant,
      },
      locale: 'de',
    });
  } else {
    /* eslint-disable prefer-destructuring */
    home = homeDocs.docs[0];
    /* eslint-enable prefer-destructuring */
  }

  return {
    home,
    payload,
    tenant,
    user,
  };
};
