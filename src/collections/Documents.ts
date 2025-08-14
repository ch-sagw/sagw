import type { CollectionConfig } from 'payload';

export const Documents: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    group: 'Global Content',
  },
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      name: 'project',
      relationTo: 'projects',
      required: false,
      type: 'relationship',
    },
  ],
  slug: 'documents',
  upload: true,
};
