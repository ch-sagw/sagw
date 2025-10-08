import { Block } from 'payload';
import {
  rte1, rte2,
} from '@/field-templates/rte';

// Example: Magazine detail page

export const FootnotesBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte1({
      name: 'title',
    }),
    rte2({
      name: 'text',
    }),
  ],
  imageURL: '/admin-ui-images/notification.svg',
  interfaceName: 'InterfaceFootnotesBlock',
  labels: {
    plural: 'Footnotes',
    singular: 'Footnote',
  },
  slug: 'footnoteBlock',
} as const satisfies Block;
