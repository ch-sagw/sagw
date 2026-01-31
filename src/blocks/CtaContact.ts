import { fieldsColorMode } from '@/field-templates/colorMode';
import { Block } from 'payload';
import { rte1 } from '@/field-templates/rte';
import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';

// Example: Early Career Award

export const CtaContactBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte1({
      name: 'title',
    }),
    rte1({
      label: 'Subtitle',
      name: 'text',
    }),
    fieldsColorMode({
      dark: true,
      light: true,
      white: true,
    }),
    {
      access: fieldAccessNonLocalizableField,
      hasMany: true,
      label: 'Select a person',
      name: 'contact',
      relationTo: 'people',
      required: true,
      type: 'relationship',
    },
  ],
  imageURL: '/admin-ui-images/cta-contact.svg',
  interfaceName: 'InterfaceCtaContactBlock',
  labels: {
    plural: 'Personal Contacts',
    singular: 'Personal Contact',
  },
  slug: 'ctaContactBlock',
} as const satisfies Block;
