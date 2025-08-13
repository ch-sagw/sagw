import { Block } from 'payload';
import { rte2 } from '@/field-templates/rte';

export const TextBlock: Block = {
  fields: [
    {
      editor: rte2,
      localized: true,
      name: 'text',
      required: false,
      type: 'richText',
    },
  ],
  slug: 'textBlock',
};
