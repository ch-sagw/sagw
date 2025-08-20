import { fieldsLinkExternal } from '@/field-templates/links';
import { Block } from 'payload';

export const LinkExternal: Block = {
  fields: [
    ...fieldsLinkExternal,
    {
      localized: true,
      name: 'description',
      required: true,
      type: 'text',
    },
  ],
  slug: 'linkExternal',
};
