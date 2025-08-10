import { Block } from 'payload';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';

export const SubpageSectionBlock: Block = {
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'text',
      required: true,
      type: 'textarea',
    },
    ...fieldsLinkInternalOrExternal,
  ],
  slug: 'subpageSectionBlock',
};
