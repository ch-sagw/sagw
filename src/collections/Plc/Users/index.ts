import type { CollectionConfig } from 'payload';
import { createAccess } from '@/collections/Plc/Users/access/create';
import { readAccess } from '@/collections/Plc/Users/access/read';
import { updateAndDeleteAccess } from '@/collections/Plc/Users/access/updateAndDelete';
import { ensureUniqueUsername } from '@/collections/Plc/Users/hooks/ensureUniqueUsername';
import { isSuperAdmin } from '@/access/isSuperAdmin';
import { setCookieBasedOnDomain } from '@/collections/Plc/Users/hooks/setCookieBasedOnDomain';
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields';
import {
  tenantRoles, userRoles,
} from '@/collections/Plc/Users/roles';

const defaultTenantArrayField = tenantsArrayField({
  arrayFieldAccess: {},
  rowFields: [
    {
      access: {
        update: ({
          req,
        }): boolean => {
          const {
            user,
          } = req;

          if (!user) {
            return false;
          }

          if (isSuperAdmin(user)) {
            return true;
          }

          return true;
        },
      },
      defaultValue: [tenantRoles.editor],
      hasMany: true,
      name: 'roles',
      options: [
        tenantRoles.admin,
        tenantRoles.editor,
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
      access: {
        update: ({
          req,
        }) => isSuperAdmin(req.user),
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
  hooks: {
    afterLogin: [setCookieBasedOnDomain],
  },
  slug: 'users',
};
