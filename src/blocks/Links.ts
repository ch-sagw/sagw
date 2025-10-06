import { Block } from 'payload';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';
import { rte1 } from '@/field-templates/rte';

// Example: Magazine Detail

export const LinksBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte1({
      name: 'title',
      required: true,
    }),
    {
      fields: fieldsLinkInternalOrExternal,
      name: 'links',
      type: 'array',
    },
  ],
  imageURL: '/admin-ui-images/links.svg',
  interfaceName: 'InterfaceLinksBlock',
  labels: {
    plural: 'Links',
    singular: 'Links',
  },
  slug: 'linksBlock',
};
