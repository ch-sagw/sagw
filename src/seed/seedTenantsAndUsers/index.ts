import { Payload } from 'payload';
import { seedTenants } from '@/seed/seedTenantsAndUsers/seedTenants';
import { seedUsers } from '@/seed/seedTenantsAndUsers/seedUsers';
import { Tenant } from '@/payload-types';

interface InterfaceSeedTenantsAndUsers {
  payload: Payload;
}

export const seedTenantsAndUsers = async (props: InterfaceSeedTenantsAndUsers): Promise<Tenant[]> => {

  // Seed tenants

  const tenants = await seedTenants({
    payload: props.payload,
    tenants: [
      {
        name: 'sagw',
        slug: 'sagw',
      },
      {
        name: 'not-sagw',
        slug: 'not-sagw',
      },
    ],
  });

  if (!tenants) {
    return [];
  }

  const sagwTenant = tenants?.filter((tenant) => tenant.name === 'sagw');
  const notSagwTenant = tenants?.filter((tenant) => tenant.name === 'not-sagw');

  if (!(sagwTenant && sagwTenant.length === 1) || !(notSagwTenant && notSagwTenant.length === 1)) {
    return [];
  }

  // Seed users

  if (
    !process.env.USER_SUPER_ADMIN_MAIL || !process.env.USER_SUPER_ADMIN_PASS ||
    !process.env.USER_SAGW_ADMIN_MAIL || !process.env.USER_SAGW_ADMIN_PASS ||
    !process.env.USER_FG_ADMIN_MAIL || !process.env.USER_FG_ADMIN_PASS ||
    !process.env.USER_MAGAZINE_EDITOR_MAIL || !process.env.USER_MAGAZINE_EDITOR_PASS ||
    !process.env.USER_TRANSLATOR_MAIL || !process.env.USER_TRANSLATOR_PASS ||
    !process.env.USER_MARTIN_MAIL || !process.env.USER_MARTIN_PASS ||
    !process.env.USER_STELLA_MAIL || !process.env.USER_STELLA_PASS ||
    !process.env.USER_MARIUS_MAIL || !process.env.USER_MARIUS_PASS ||
    !process.env.USER_YVES_MAIL || !process.env.USER_YVES_PASS
  ) {
    props.payload.logger.error('env vars missing for user mail/password.');

    return [];
  }

  await seedUsers({
    payload: props.payload,
    users: [

      // super admin
      {
        email: process.env.USER_SUPER_ADMIN_MAIL,
        password: process.env.USER_SUPER_ADMIN_PASS,
        userRole: 'super-admin',
        username: 'super-admin',
      },

      // sagw admin
      {
        email: process.env.USER_SAGW_ADMIN_MAIL,
        password: process.env.USER_SAGW_ADMIN_PASS,
        tenant: sagwTenant[0],
        tenantRole: 'tenant-admin',
        userRole: 'global-user',
        username: 'sagw-admin',
      },

      // fg admin
      {
        email: process.env.USER_FG_ADMIN_MAIL,
        password: process.env.USER_FG_ADMIN_PASS,
        tenant: notSagwTenant[0],
        tenantRole: 'tenant-admin',
        userRole: 'global-user',
        username: 'non-sagw-admin',
      },

      // magazine editor
      {
        email: process.env.USER_MAGAZINE_EDITOR_MAIL,
        password: process.env.USER_MAGAZINE_EDITOR_PASS,
        tenant: sagwTenant[0],
        tenantRole: 'editor-magazine',
        userRole: 'global-user',
        username: 'editor-magazine',
      },

      // translator
      {
        email: process.env.USER_TRANSLATOR_MAIL,
        password: process.env.USER_TRANSLATOR_PASS,
        tenant: sagwTenant[0],
        tenantRole: 'translator',
        userRole: 'global-user',
        username: 'translator',
      },

      // user for stella noack
      {
        email: process.env.USER_STELLA_MAIL,
        password: process.env.USER_STELLA_PASS,
        tenant: sagwTenant[0],
        tenantRole: 'tenant-admin',
        userRole: 'global-user',
        username: 'sagw-admin',
      },

      // user for martin von siebenthal
      {
        email: process.env.USER_MARTIN_MAIL,
        password: process.env.USER_MARTIN_PASS,
        tenant: sagwTenant[0],
        tenantRole: 'tenant-admin',
        userRole: 'global-user',
        username: 'sagw-admin',
      },

      // user for marius
      {
        email: process.env.USER_MARIUS_MAIL,
        password: process.env.USER_MARIUS_PASS,
        tenant: sagwTenant[0],
        tenantRole: 'tenant-admin',
        userRole: 'global-user',
        username: 'sagw-admin',
      },

      // user for yves
      {
        email: process.env.USER_YVES_MAIL,
        password: process.env.USER_YVES_PASS,
        tenant: sagwTenant[0],
        tenantRole: 'tenant-admin',
        userRole: 'global-user',
        username: 'sagw-admin',
      },
    ],
  });

  return tenants;
};
