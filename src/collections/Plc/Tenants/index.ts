import { type CollectionConfig } from 'payload';
import {
  fieldsAccess, languageAccess, tenantsAccess,
} from '@/access/tenants';
import { isSuperOrTenantAdmin } from '../Users/roles';
import { hookTenantsAfterCreate } from '@/hooks-payload/tenantsAfterChange';
import { hookTenantsBeforeDelete } from '@/hooks-payload/tenantsBeforeDelete';
import { validateTenantName } from '@/hooks-payload/validateTenantName';

export const Tenants: CollectionConfig = {
  access: tenantsAccess,
  admin: {
    defaultColumns: [
      'title',
      'slug',
    ],
    group: 'Org',
    hidden: ({
      user,
    }): boolean => !isSuperOrTenantAdmin(user),
    hideAPIURL: process.env.ENV === 'prod',
    useAsTitle: 'title',
  },
  fields: [
    {
      access: fieldsAccess,
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      access: fieldsAccess,
      admin: {
        description: 'Used for url paths, example: /tenant-slug/page-slug',
      },
      hooks: {
        beforeValidate: [validateTenantName],
      },
      index: true,
      localized: true,
      name: 'slug',
      required: true,
      type: 'text',
    },
    {
      access: fieldsAccess,
      index: true,
      localized: false,
      name: 'faviconName',
      required: true,
      type: 'text',
      unique: false,
    },
    {
      fields: [
        {
          access: languageAccess,
          defaultValue: true,
          name: 'de',
          type: 'checkbox',
        },
        {
          access: languageAccess,
          defaultValue: true,
          name: 'fr',
          type: 'checkbox',
        },
        {
          access: languageAccess,
          defaultValue: true,
          name: 'it',
          type: 'checkbox',
        },
        {
          access: languageAccess,
          defaultValue: true,
          name: 'en',
          type: 'checkbox',
        },
      ],
      name: 'languages',
      type: 'group',
    },
  ],
  hooks: {
    afterChange: [hookTenantsAfterCreate],
    beforeDelete: [hookTenantsBeforeDelete],
  },
  slug: 'tenants',
};
