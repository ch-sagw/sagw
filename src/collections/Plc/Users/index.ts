import type { CollectionConfig } from 'payload';
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields';

import { createAccess } from '@/collections/Plc/Users/access/create';
import { readAccess } from '@/collections/Plc/Users/access/read';
import { updateAndDeleteAccess } from '@/collections/Plc/Users/access/updateAndDelete';
import { ensureUniqueUsername } from '@/collections/Plc/Users/hooks/ensureUniqueUsername';
import { isGlobalAdmin } from '@/access/isGlobalAdmin';
import {
  departmentRoles, userRoles,
} from '@/collections/Plc/Users/roles';
// import { setTenantAfterLogin }
// from '@/collections/Plc/Users/hooks/afterMeHook';

const defaultDepartmentArrayField = tenantsArrayField({
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
  tenantsArrayFieldName: 'departments',
  tenantsArrayTenantFieldName: 'department',
  tenantsCollectionSlug: 'departments',
});

export const Users: CollectionConfig = {
  access: {
    create: createAccess,
    delete: updateAndDeleteAccess,
    read: readAccess,
    update: updateAndDeleteAccess,
  },
  admin: {
    group: 'Org',
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
      ...defaultDepartmentArrayField,
      admin: {
        ...(defaultDepartmentArrayField?.admin || {}),
        position: 'sidebar',
      },
    },
  ],

  /*
    There is the issue that multitenant-plugin is not setting the tenant
    cookie after autologin. we might do it manually.
  */
  /*
  hooks: {
    afterMe: [setTenantAfterLogin],
  },
  */

  slug: 'users',
};
