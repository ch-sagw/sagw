import { Block } from 'payload';
import { rte2 } from '@/field-templates/rte';

export const TextBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      editor: rte2,
      localized: true,
      name: 'text',
      required: true,
      type: 'richText',
    },
  ],
  labels: {
    plural: 'Richtext',
    singular: 'Richtext',
  },
  slug: 'textBlock',
};
