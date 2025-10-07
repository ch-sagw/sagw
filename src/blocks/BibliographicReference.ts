import { Block } from 'payload';
import { rte3 } from '@/field-templates/rte';

// Example: Publication Detail Page

export const BibliographicReferenceBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte3({
      name: 'text',
      required: true,
    }),
  ],
  imageURL: '/admin-ui-images/bibliographic-reference.svg',
  interfaceName: 'InterfaceBibliographicReferenceBlock',
  labels: {
    plural: 'Bibliographic References',
    singular: 'Bibliographic Reference',
  },
  slug: 'bibliographicReferenceBlock',
};
