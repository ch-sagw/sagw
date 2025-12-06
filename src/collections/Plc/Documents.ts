import type { CollectionConfig } from 'payload';
import { rte2 } from '@/field-templates/rte';
import { assetsAccess } from '@/access/assets';

export const Documents: CollectionConfig = {
  access: assetsAccess,
  admin: {
    description: 'Allowed formats: pdf',
    group: 'Assets',
    hideAPIURL: process.env.ENV === 'prod',
  },
  fields: [
    rte2({
      name: 'title',
    }),
    {
      admin: {
        width: '50%',
      },
      fields: [
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
      type: 'row',
    },
  ],
  slug: 'documents',
  upload: {
    mimeTypes: ['application/pdf'],
  },
};
