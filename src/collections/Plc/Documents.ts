import type { CollectionConfig } from 'payload';
import { rte2 } from '@/field-templates/rte';
import { assetsAccess } from '@/access/assets';

export const Documents: CollectionConfig = {
  access: assetsAccess,
  admin: {
    description: 'Allowed formats: pdf',
    group: 'Assets',
  },
  fields: [
    rte2({
      name: 'title',
    }),
    {
      name: 'date',
      required: false,
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
};
