import { Block } from 'payload';
import { rte4 } from '@/field-templates/rte';

// Example: Magazine Detail

export const TextBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte4({
      name: 'text',
    }),
  ],
  imageURL: '/admin-ui-images/richtext.svg',
  interfaceName: 'InterfaceTextBlock',
  labels: {
    plural: 'Richtext',
    singular: 'Richtext',
  },
  slug: 'textBlock',
} as const satisfies Block;
