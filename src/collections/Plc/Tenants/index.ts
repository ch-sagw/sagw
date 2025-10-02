import type { CollectionConfig } from 'payload';

import { isSuperAdminAccess } from '@/access/isSuperAdmin';
import { updateAndDeleteAccess } from '@/collections/Plc/Tenants/access/updateAndDelete';

export const Tenants: CollectionConfig = {
  access: {
    create: isSuperAdminAccess,
    delete: updateAndDeleteAccess,
    read: ({
      req,
    }) => Boolean(req.user),
    update: updateAndDeleteAccess,
  },
  admin: {
    defaultColumns: [
      'name',
      'domain',
      'slug',
    ],
    group: 'Org',
    useAsTitle: 'name',
  },
  fields: [
    {
      localized: true,
      name: 'name',
      required: true,
      type: 'text',
      unique: true,
    },
    {
      admin: {
        description: 'Used for domain-based tenant handling',
      },
      name: 'domain',
      type: 'text',
      unique: true,
    },
    {
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
          defaultValue: true,
          name: 'de',
          type: 'checkbox',
        },
        {
          defaultValue: true,
          name: 'fr',
          type: 'checkbox',
        },
        {
          defaultValue: true,
          name: 'it',
          type: 'checkbox',
        },
        {
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
