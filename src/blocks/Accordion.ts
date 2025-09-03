import {
  Block, Field,
} from 'payload';
import { rte2 } from '@/field-templates/rte';
import { fieldsColorMode } from '@/field-templates/colorMode';

// Example: Promotion page

const AccordionItem: Field[] = [
  {
    localized: true,
    name: 'accordionTitle',
    required: true,
    type: 'text',
  },
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
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    ...fieldsColorMode,
    {
      fields: AccordionItem,
      name: 'acccordions',
      required: true,
      type: 'array',
    },

  ],
  imageURL: '/admin-ui-images/accordion.svg',
  labels: {
    plural: 'Accordions',
    singular: 'Accordion',
  },
  slug: 'accordionBlock',
};
