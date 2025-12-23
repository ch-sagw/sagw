import { type CollectionConfig } from 'payload';
import { hookComputeLinkUrls } from '@/hooks-payload/computeLinkUrls';

export const Links: CollectionConfig = {
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  admin: {
    defaultColumns: [
      'slug',
      'references',
    ],
    // hidden: true,
  },
  fields: [
    {
      index: true,
      name: 'documentId',
      required: true,
      type: 'text',
      unique: true,
    },
    {
      index: true,
      name: 'slug',
      required: true,
      type: 'text',
    },
    {
      defaultValue: [],
      fields: [
        {
          name: 'pageId',
          type: 'text',
        },
      ],
      name: 'references',
      type: 'array',
    },
  ],
  hooks: {
    afterRead: [hookComputeLinkUrls],
  },
  slug: 'links',
};
