import type { CollectionConfig } from 'payload';
import { ensureUniqueUsername } from '@/collections/Plc/Users/hooks/ensureUniqueUsername';
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields';
import {
  tenantRoles, userRoles,
} from '@/collections/Plc/Users/roles';
import {
  usersAccess, usersFieldAccess, usersFieldAccessReadSelf,
} from '@/access/users';
import { lockDocuments } from '@/field-templates/lockDocuments';

const defaultTenantArrayField = tenantsArrayField({
  arrayFieldAccess: usersFieldAccessReadSelf,
  rowFields: [
    {
      access: usersFieldAccessReadSelf,
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
  tenantFieldAccess: usersFieldAccessReadSelf,
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
      access: usersFieldAccessReadSelf,
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
  lockDocuments,
  slug: 'users',
};
