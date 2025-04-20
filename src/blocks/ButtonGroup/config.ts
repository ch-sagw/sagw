import type { Block } from 'payload';
import { ButtonConfig } from '@/components/Button/config';

export const ButtonGroup: Block = {
  fields: [
    {
      // required: true,
      fields: [
        {
          fields: [...ButtonConfig],
          interfaceName: 'InterfaceButton',
          name: 'button',
          type: 'group',
        },
      ],
      name: 'buttons',
      type: 'array',
    },
  ],
  interfaceName: 'ButtonGroup',
  slug: 'ButtonGroup',
};
