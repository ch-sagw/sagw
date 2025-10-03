import {
  Block, Field,
} from 'payload';
import {
  rte1, rte2,
} from '@/field-templates/rte';
import { fieldsColorMode } from '@/field-templates/colorMode';

// Example: Promotion page

const AccordionItem: Field[] = [
  rte1({
    name: 'accordionTitle',
    required: true,
  }),
  rte2({
    name: 'accordionContent',
    required: true,
  }),
];

export const AccordionBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      fields: [
        rte1({
          name: 'title',
          required: true,
        }),
        {
          name: 'titleLevel',
          options: [
            {
              label: '2',
              value: '2',
            },
            {
              label: '3',
              value: '3',
            },
            {
              label: '4',
              value: '4',
            },
            {
              label: '5',
              value: '5',
            },
          ],
          required: true,
          type: 'radio',
        },
      ],
      type: 'row',
    },
    ...fieldsColorMode({
      dark: true,
      light: true,
      white: true,
    }),
    {
      fields: AccordionItem,
      name: 'accordions',
      required: true,
      type: 'array',
    },

  ],
  imageURL: '/admin-ui-images/accordion.svg',
  interfaceName: 'InterfaceAccordionBlock',
  labels: {
    plural: 'Accordions',
    singular: 'Accordion',
  },
  slug: 'accordionBlock',
};
