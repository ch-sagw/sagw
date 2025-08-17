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
      type: 'text',
    },
    {
      admin: {
        hidden: true,
      },
      name: 'publicationDate',
      type: 'date',
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
