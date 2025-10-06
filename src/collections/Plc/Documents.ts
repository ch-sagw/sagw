import type { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';
import { rte1 } from '@/field-templates/rte';

export const Documents: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    group: 'Assets',
  },
  fields: [
    rte1({
      name: 'title',
      required: true,
    }),
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
