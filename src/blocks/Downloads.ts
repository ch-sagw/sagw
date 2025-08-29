import { Block } from 'payload';

// Example: Publication Detail

export const DownloadsBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      hasMany: true,
      name: 'downloads',
      relationTo: [
        'documents',
        'zenodoDocuments',
      ],
      type: 'relationship',
    },
  ],
  labels: {
    plural: 'Downloads',
    singular: 'Downloads',
  },
  slug: 'downloadsBlock',
};
