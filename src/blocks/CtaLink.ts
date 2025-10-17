import { Block } from 'payload';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';
import { rte1 } from '@/field-templates/rte';

// Example: Early Career Award

export const CtaLinkBlock = {
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
    ...fieldsLinkInternalOrExternal,
  ],
  imageURL: '/admin-ui-images/cta-link.svg',
  interfaceName: 'InterfaceCtaLinkBlock',
  labels: {
    plural: 'CTAs Link',
    singular: 'CTA Link',
  },
  slug: 'ctaLinkBlock',
} as const satisfies Block;
