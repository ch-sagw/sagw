import type { CollectionConfig } from 'payload';
import { rte2 } from '@/field-templates/rte';
import { assetsAccess } from '@/access/assets';
import {
  hookInvalidateTenantCache, hookInvalidateTenantCacheOnDelete,
} from '@/hooks-payload/invalidateTenantCache';
import { lockDocuments } from '@/field-templates/lockDocuments';

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
          admin: {
            description: 'Date of the publication of the document should be added, not the publishing date on website.',
          },
          name: 'date',
          required: false,
          type: 'date',
        },
        {
          admin: {
            description: 'If the document belongs to a project, add the project.',
          },
          name: 'project',
          relationTo: 'projects',
          required: false,
          type: 'relationship',
        },
      ],
      type: 'row',
    },
  ],
  hooks: {
    afterChange: [hookInvalidateTenantCache],
    afterDelete: [hookInvalidateTenantCacheOnDelete],
  },
  lockDocuments,
  slug: 'documents',
  upload: {
    mimeTypes: ['application/pdf'],
  },
};
