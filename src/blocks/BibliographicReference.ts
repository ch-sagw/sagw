import { Block } from 'payload';
import { rte3 } from '@/field-templates/rte';

// Example: Publication Detail Page

export const BibliographicReferenceBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte3({
      name: 'text',
    }),
  ],
  imageURL: '/admin-ui-images/bibliographic-reference.svg',
  interfaceName: 'InterfaceBibliographicReferenceBlock',
  labels: {
    plural: 'Bibliographic References',
    singular: 'Bibliographic Reference',
  },
  slug: 'bibliographicReferenceBlock',
} as const satisfies Block;
