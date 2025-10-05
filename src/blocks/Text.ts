import { Block } from 'payload';
import { rte3 } from '@/field-templates/rte';

// Example: Magazine Detail

export const TextBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte3({
      name: 'text',
      required: true,
    }),
  ],
  imageURL: '/admin-ui-images/richtext.svg',
  interfaceName: 'InterfaceTextBlock',
  labels: {
    plural: 'Richtext',
    singular: 'Richtext',
  },
  slug: 'textBlock',
};
