import { type CollectionConfig } from 'payload';
import { hookHandleLinksDeletion } from '@/hooks-payload/handleLinksDeletion';
import { hookRegenerateLinksOnUrlChange } from '@/hooks-payload/regenerateLinksOnUrlChange';

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
      'deleted',
    ],
    hidden: true,
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
      fields: [
        {
          name: 'de',
          type: 'text',
        },
        {
          name: 'fr',
          type: 'text',
        },
        {
          name: 'it',
          type: 'text',
        },
        {
          name: 'en',
          type: 'text',
        },
      ],
      interfaceName: 'InterfacePageUrls',
      name: 'url',
      type: 'group',
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
    {
      defaultValue: false,
      name: 'deleted',
      type: 'checkbox',
    },
  ],
  hooks: {
    afterChange: [hookRegenerateLinksOnUrlChange],
    beforeChange: [hookHandleLinksDeletion],
  },
  slug: 'links',
};
