import type { CollectionConfig } from 'payload';

import { isGlobalAdminAccess } from '@/access/isGlobalAdmin';
import { updateAndDeleteAccess } from '@/collections/Plc/Departments/access/updateAndDelete';

export const Departments: CollectionConfig = {
  access: {
    create: isGlobalAdminAccess,
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
        description: 'Used for domain-based department handling',
      },
      name: 'domain',
      type: 'text',
      unique: true,
    },
    {
      admin: {
        description: 'Used for url paths, example: /department-slug/page-slug',
      },
      index: true,
      localized: true,
      name: 'slug',
      required: true,
      type: 'text',
      unique: true,
    },
  ],
  slug: 'departments',
};
