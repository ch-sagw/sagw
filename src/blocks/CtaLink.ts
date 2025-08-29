import { Block } from 'payload';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';

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
  labels: {
    plural: 'CTAs Link',
    singular: 'CTA Link',
  },
  slug: 'ctaLinkBlock',
};
