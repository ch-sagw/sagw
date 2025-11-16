import type { CollectionConfig } from 'payload';
import { ensureUniqueUsername } from '@/collections/Plc/Users/hooks/ensureUniqueUsername';
import { isSuperAdmin } from '@/access/isSuperAdmin';
import { setCookieBasedOnDomain } from '@/collections/Plc/Users/hooks/setCookieBasedOnDomain';
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields';
import {
  tenantRoles, userRoles,
} from '@/collections/Plc/Users/roles';
import { usersAccess } from '@/access/users';

const defaultTenantArrayField = tenantsArrayField({
  arrayFieldAccess: usersAccess,
  rowFields: [
    {
      access: usersAccess,
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
  tenantFieldAccess: usersAccess,
  tenantsArrayFieldName: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  tenantsCollectionSlug: 'tenants',
});

export const Users: CollectionConfig = {
  access: usersAccess,
  admin: {
    group: 'Org',
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      access: {
        read: () => false,
        update: ({
          req, id,
        }): boolean => {
          const {
            user,
          } = req;

          if (!user) {
            return false;
          }

          if (id === user.id) {
            // Allow user to update their own password
            return true;
          }

          return isSuperAdmin(user);
        },
      },
      hidden: true,
      name: 'password',
      type: 'text',
    },
    {
      access: usersAccess,
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
