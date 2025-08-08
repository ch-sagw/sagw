import { Block } from 'payload';

export const TextBlock: Block = {
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'text',
      required: true,
      type: 'richText',
    },
  ],
  labels: {
    plural: 'Network Blocks',
    singular: 'Network Block',
  },
  slug: 'textBlock',
};
