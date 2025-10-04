import type { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';

export const Documents: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    group: 'Assets',
  },
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      name: 'date',
      required: true,
      type: 'date',
    },
    {
      name: 'project',
      relationTo: 'projects',
      required: false,
      type: 'relationship',
    },
  ],
  slug: 'documents',
  upload: {
    mimeTypes: ['application/pdf'],
  },
  versions,
};
