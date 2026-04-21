import { type CollectionConfig } from 'payload';
import {
  fieldsAccess, languageAccess, tenantsCollectionAccess,
} from '@/access/tenants';
import { isSuperOrTenantAdmin } from '../Users/roles';
import { hookTenantsAfterCreate } from '@/hooks-payload/tenantsAfterChange';
import { hookTenantsBeforeDelete } from '@/hooks-payload/tenantsBeforeDelete';
import { validateTenantName } from '@/hooks-payload/validateTenantName';
import { lockDocuments } from '@/field-templates/lockDocuments';

export const Tenants: CollectionConfig = {
  access: tenantsCollectionAccess,
  admin: {
    defaultColumns: [
      'name',
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
      admin: {
        description: 'Used for url paths, example: /tenant-slug/page-slug',
      },
      index: true,
      localized: false,
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
  lockDocuments,
  slug: 'tenants',
};
