import { Block } from 'payload';

export const DownloadsBlock: Block = {
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
    plural: 'Downloads Blocks',
    singular: 'Downloads Block',
  },
  slug: 'downloadsBlock',
};
