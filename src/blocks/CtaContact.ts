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
    {
      hasMany: false,
      name: 'contact',
      relationTo: 'people',
      required: true,
      type: 'relationship',
    },
  ],
  labels: {
    plural: 'CTAs Contact',
    singular: 'CTA Contact',
  },
  slug: 'ctaContactBlock',
};
