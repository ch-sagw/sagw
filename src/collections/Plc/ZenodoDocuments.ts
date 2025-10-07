// TODO:
// - the id 15126918 returns multiple files. how to display it?

import type { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';

export const ZenodoDocuments: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    defaultColumns: [
      'title',
      'zenodoId',
      'publicationDate',
      'files',
    ],
    group: 'Assets',
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
  slug: 'zenodoDocuments',
  versions,
};
