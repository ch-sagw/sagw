import { fieldsColorMode } from '@/field-templates/colorMode';
import { Block } from 'payload';

// Example: Early Career Award

export const CtaContactBlock: Block = {
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
    {
      localized: true,
      name: 'text',
      required: true,
      type: 'text',
    },
    fieldsColorMode({
      dark: true,
      light: true,
      white: true,
    }),
    {
      hasMany: false,
      name: 'contact',
      relationTo: 'people',
      required: true,
      type: 'relationship',
    },
  ],
  imageURL: '/admin-ui-images/cta-contact.svg',
  interfaceName: 'InterfaceCtaContactBlock',
  labels: {
    plural: 'CTAs Contact',
    singular: 'CTA Contact',
  },
  slug: 'ctaContactBlock',
};
