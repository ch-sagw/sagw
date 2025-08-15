import type { CollectionConfig } from 'payload';

import { isSuperAdminAccess } from '@/access/isSuperAdmin';
import { updateAndDeleteAccess } from './access/updateAndDelete';

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
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      required: true,
      type: 'text',
    },
    {
      admin: {
        description: 'Used for domain-based tenant handling',
      },
      name: 'domain',
      type: 'text',
    },
    {
      admin: {
        description: 'Used for url paths, example: /tenant-slug/page-slug',
      },
      index: true,
      name: 'slug',
      required: true,
      type: 'text',
    },
    {
      admin: {
        description:
          'If checked, logging in is not required to read. Useful for building public pages.',
        position: 'sidebar',
      },
      defaultValue: false,
      index: true,
      name: 'allowPublicRead',
      type: 'checkbox',
    },
  ],
  slug: 'tenants',
};
