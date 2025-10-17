import {
  Block, Field,
} from 'payload';
import {
  rte1, rte3,
} from '@/field-templates/rte';
import { fieldsColorMode } from '@/field-templates/colorMode';

// Example: Promotion page

const AccordionItem: Field[] = [
  rte1({
    name: 'accordionTitle',
  }),
  rte3({
    name: 'accordionContent',
  }),
];

export const AccordionBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      fields: [
        rte1({
          name: 'title',
        }),
      ],
      type: 'row',
    },
    fieldsColorMode({
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
} as const satisfies Block;
