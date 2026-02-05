import { Block } from 'payload';
import {
  rte1, rte3,
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
    rte3({
      name: 'text',
    }),
  ],
  imageURL: '/admin-ui-images/notification.svg',
  interfaceName: 'InterfaceFootnotesBlock',
  labels: {
    plural: 'Small Texts',
    singular: 'Small Text',
  },
  slug: 'footnoteBlock',
} as const satisfies Block;
