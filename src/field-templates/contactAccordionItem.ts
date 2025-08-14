import { Field } from 'payload';

export const fieldsContactAccordionItem: Field[] = [
  {
    localized: true,
    name: 'title',
    required: true,
    type: 'text',
  },
  {
    hasMany: true,
    name: 'category',
    relationTo: 'people',
    required: true,
    type: 'relationship',
  },
];
