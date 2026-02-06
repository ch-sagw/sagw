import { test } from '@playwright/test';
import { Payload } from 'payload';
import { User } from '@/payload-types';
import { getPayloadCached } from '@/utilities/getPayloadCached';

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

  if (!user) {
    throw new Error('Login failed: user is undefined');
  }

  let tenant;

  if (type !== 'super-admin') {
    tenant = user.tenants?.[0]?.tenant;

    if (!tenant || typeof tenant !== 'string') {
      throw new Error('User has no tenant');
    }
  }

  return {
    payload,
    tenant,
    user: {
      ...user,
      collection: 'users' as const,
    },
  };
};
