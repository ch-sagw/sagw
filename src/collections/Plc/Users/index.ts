import type { CollectionConfig } from 'payload';
import { ensureUniqueUsername } from '@/collections/Plc/Users/hooks/ensureUniqueUsername';
import { setCookieBasedOnDomain } from '@/collections/Plc/Users/hooks/setCookieBasedOnDomain';
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields';
import {
  tenantRoles, userRoles,
} from '@/collections/Plc/Users/roles';
import {
  usersAccess, usersFieldAccess, usersFieldAccessWithoutSelf,
} from '@/access/users';

const defaultTenantArrayField = tenantsArrayField({
  arrayFieldAccess: usersFieldAccessWithoutSelf,
  rowFields: [
    {
      access: usersFieldAccessWithoutSelf,
      defaultValue: [tenantRoles.admin],
      hasMany: true,
      name: 'roles',
      options: [
        tenantRoles.admin,
        tenantRoles.editorMagazine,
        tenantRoles.translator,
      ],
      required: true,
      type: 'select',
    },
  ],
  tenantFieldAccess: usersFieldAccessWithoutSelf,
  tenantsArrayFieldName: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  tenantsCollectionSlug: 'tenants',
});

export const Users: CollectionConfig = {
  access: usersAccess,
  admin: {
    group: 'Org',
    hideAPIURL: process.env.ENV === 'prod',
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      access: usersFieldAccess,
      hidden: true,
      name: 'password',
      type: 'text',
    },
    {
      access: usersFieldAccessWithoutSelf,
      admin: {
        position: 'sidebar',
      },
      defaultValue: [userRoles.user],
      hasMany: true,
      name: 'roles',
      options: [
        userRoles.admin,
        userRoles.user,
      ],
      type: 'select',
    },
    {
      hooks: {
        beforeValidate: [ensureUniqueUsername],
      },
      index: true,
      name: 'username',
      type: 'text',
    },
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField?.admin || {}),
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterLogin: [setCookieBasedOnDomain],
  },
  slug: 'users',
};
