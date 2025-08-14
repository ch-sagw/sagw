import { Field } from 'payload';
import { fieldsSubpageSectionBlock } from './SubpageSectionBlock';

export const fieldsSubpageSection: Field[] = [
  {
    localized: true,
    name: 'title',
    required: true,
    type: 'text',
  },
  {
    localized: true,
    name: 'lead',
    required: true,
    type: 'text',
  },
  {
    defaultValue: 'vertical',
    name: 'alignement',
    options: [
      {
        label: 'vertical',
        value: 'vertical',
      },
      {
        label: 'horizontal',
        value: 'horizontal',
      },
    ],
    type: 'select',
  },
  {
    fields: fieldsSubpageSectionBlock,
    name: 'blocks',
    required: true,
    type: 'array',
  },
];
