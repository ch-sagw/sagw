import {
  Block, Field,
} from 'payload';
import {
  rte1, rte4,
} from '@/field-templates/rte';
import { fieldsColorMode } from '@/field-templates/colorMode';
import {
  fieldAccessLocalizableField, fieldAccessNonLocalizableField,
} from '@/access/fields/localizedFields';

// Example: Promotion page

const AccordionItem: Field[] = [
  rte1({
    access: fieldAccessLocalizableField,
    name: 'accordionTitle',
  }),
  rte4({
    access: fieldAccessLocalizableField,
    label: 'Accordion Text',
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
          access: fieldAccessLocalizableField,
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
      access: fieldAccessNonLocalizableField,
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
