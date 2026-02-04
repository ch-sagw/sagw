import type { CollectionConfig } from 'payload';
import { assetsAccess } from '@/access/assets';
import {
  hookInvalidateCacheOnReferencedCollectionChange,
  hookInvalidateCacheOnReferencedCollectionDelete,
} from '@/hooks-payload/invalidateCacheOnReferencedCollectionChange';

export const ZenodoDocuments: CollectionConfig = {
  access: assetsAccess,
  admin: {
    defaultColumns: [
      'title',
      'zenodoId',
      'publicationDate',
      'files',
    ],
    group: 'Assets',
    hideAPIURL: process.env.ENV === 'prod',
    useAsTitle: 'title',
  },
  fields: [
    {
      admin: {
        hidden: true,
      },
      name: 'zenodoId',
      required: true,
      type: 'text',
    },
    {
      admin: {
        hidden: true,
      },
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      admin: {
        hidden: true,
      },
      name: 'publicationDate',
      required: true,
      type: 'text',
    },
    {
      admin: {
        hidden: true,
      },
      fields: [
        {
          name: 'link',
          type: 'text',
        },
        {
          name: 'format',
          type: 'text',
        },
        {
          name: 'size',
          type: 'number',
        },
      ],
      name: 'files',
      required: true,
      type: 'array',
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
    {
      admin: {
        components: {
          Field: {
            path: '@/components/admin/ZenodoDocumentChooser/ZenodoDocumentChooser',
          },
        },
      },
      name: 'chooser',
      type: 'ui',
    },
  ],
  hooks: {
    afterChange: [hookInvalidateCacheOnReferencedCollectionChange],
    afterDelete: [hookInvalidateCacheOnReferencedCollectionDelete],
  },
  slug: 'zenodoDocuments',
};
