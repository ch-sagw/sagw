import type { CollectionConfig } from 'payload';
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields';

import { createAccess } from '@/collections/Users/access/create';
import { readAccess } from '@/collections/Users/access/read';
import { updateAndDeleteAccess } from '@/collections/Users/access/updateAndDelete';
import { ensureUniqueUsername } from '@/collections/Users/hooks/ensureUniqueUsername';
import { setCookieBasedOnDomain } from '@/collections/Users/hooks/setCookieBasedOnDomain';
import { isGlobalAdmin } from '@/access/isGlobalAdmin';
import {
  departmentRoles, userRoles,
} from '@/collections/Users/roles';

const defaultTenantArrayField = tenantsArrayField({
  arrayFieldAccess: {},
  rowFields: [
    {
      defaultValue: [departmentRoles.editor],
      hasMany: true,
      name: 'roles',
      options: [
        departmentRoles.admin,
        departmentRoles.editor,
        departmentRoles.editorMagazine,
        departmentRoles.translator,
      ],
      required: true,
      type: 'select',
    },
  ],
  tenantFieldAccess: {},
  tenantsArrayFieldName: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  tenantsCollectionSlug: 'tenants',
});

export const Users: CollectionConfig = {
  access: {
    create: createAccess,
    delete: updateAndDeleteAccess,
    read: readAccess,
    update: updateAndDeleteAccess,
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      access: {
        update: ({
          req,
        }) => isGlobalAdmin(req.user),
      },
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

  // The following hook sets a cookie based on the domain a user logs in from.
  // It checks the domain and matches it to a tenant in the system, then sets
  // a 'payload-tenant' cookie for that tenant.
  hooks: {
    afterLogin: [setCookieBasedOnDomain],
  },

  slug: 'users',
};
