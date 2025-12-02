import { type CollectionConfig } from 'payload';
import {
  fieldsAccess, languageAccess, tenantsAccess,
} from '@/access/tenants';
import { isSuperOrTenantAdmin } from '../Users/roles';
import { validateTenantName } from '@/hooks-payload/validateTenantName';

export const Tenants: CollectionConfig = {
  access: tenantsAccess,
  admin: {
    defaultColumns: [
      'name',
      'domain',
      'slug',
    ],
    group: 'Org',
    hidden: ({
      user,
    }): boolean => !isSuperOrTenantAdmin(user),
    hideAPIURL: process.env.ENV === 'prod',
    useAsTitle: 'name',
  },
  fields: [
    {
      access: fieldsAccess,
      hooks: {
        beforeValidate: [validateTenantName],
      },
      localized: false,
      name: 'name',
      required: true,
      type: 'text',
      unique: true,
    },
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
        description: 'Used for domain-based tenant handling',
      },
      name: 'domain',
      type: 'text',
      unique: true,
    },
    {
      access: fieldsAccess,
      admin: {
        description: 'Used for url paths, example: /tenant-slug/page-slug',
      },
      index: true,
      localized: true,
      name: 'slug',
      required: true,
      type: 'text',
      unique: true,
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
  slug: 'tenants',
};
