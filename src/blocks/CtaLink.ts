import { Block } from 'payload';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';

// Example: Early Career Award

export const CtaLinkBlock: Block = {
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
    ...fieldsLinkInternalOrExternal,
  ],
  imageURL: '/admin-ui-images/cta-link.svg',
  labels: {
    plural: 'CTAs Link',
    singular: 'CTA Link',
  },
  slug: 'ctaLinkBlock',
};
