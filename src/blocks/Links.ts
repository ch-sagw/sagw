import { Block } from 'payload';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';

// Example: Magazine Detail

export const LinksBlock: Block = {
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
