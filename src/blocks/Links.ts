import { Block } from 'payload';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';

export const LinksBlock: Block = {
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
  labels: {
    plural: 'Links Blocks',
    singular: 'Links Block',
  },
  slug: 'linksBlock',
};
