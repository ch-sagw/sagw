import { Field } from 'payload';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';

export const fieldsSubpageSectionBlock: Field[] = [
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
];
