// TODO:
// - the id 15126918 returns multiple files. how to display it?
// - if a saved value is edited, the files list won't update.

import type { CollectionConfig } from 'payload';

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
      unique: true,
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
        components: {
          Field: {
            path: 'src/components/admin/ZenodoDocumentChooser/ZenodoDocumentChooser',
          },
        },
      },
      name: 'chooser',
      type: 'ui',
    },
  ],
  slug: 'zenodoDocuments',
};
