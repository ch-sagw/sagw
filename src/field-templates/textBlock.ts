import { Field } from 'payload';
import { rte2 } from '@/field-templates/rte';

export const fieldsTextBlock: Field[] = [
  {
    editor: rte2,
    localized: true,
    name: 'text',
    required: false,
    type: 'richText',
  },
];
