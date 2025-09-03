import { Block } from 'payload';
import { rte2 } from '@/field-templates/rte';

// Example: Publication Detail Page

export const BibliographicReferenceBlock: Block = {
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
    rte2({
      name: 'text',
      required: true,
    }),
    {
      localized: true,
      name: 'copyButtonText',
      required: true,
      type: 'text',
    },
  ],
  imageURL: '/admin-ui-images/bibliographic-reference.svg',
  labels: {
    plural: 'Bibliographic References',
    singular: 'Bibliographic Reference',
  },
  slug: 'bibliographicReferenceBlock',
};
