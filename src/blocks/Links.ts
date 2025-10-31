import { Block } from 'payload';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';

// Example: Magazine Detail

export const LinksBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      fields: fieldsLinkInternalOrExternal({
        showDescription: true,
      }),
      name: 'links',
      required: true,
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
} as const satisfies Block;
