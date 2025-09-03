import { Block } from 'payload';
import { rte2 } from '@/field-templates/rte';

// Example: Magazine Detail

export const TextBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte2({
      name: 'text',
      required: true,
    }),
  ],
  imageURL: '/admin-ui-images/richtext.svg',
  labels: {
    plural: 'Richtext',
    singular: 'Richtext',
  },
  slug: 'textBlock',
};
