import { Block } from 'payload';
import { rte3 } from '@/field-templates/rte';

// Example: Magazine detail page

export const FootnotesBlock: Block = {
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
    rte3({
      name: 'text',
      required: true,
    }),
  ],
  imageURL: '/admin-ui-images/notification.svg',
  interfaceName: 'InterfaceFootnotesBlock',
  labels: {
    plural: 'Footnotes',
    singular: 'Footnote',
  },
  slug: 'footnoteBlock',
};
