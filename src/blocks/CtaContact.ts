import { fieldsColorMode } from '@/field-templates/colorMode';
import { Block } from 'payload';
import { rte1 } from '@/field-templates/rte';

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
      name: 'text',
    }),
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
} as const satisfies Block;
