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
    name: 'contact person',
    relationTo: 'people',
    required: true,
    type: 'relationship',
  },
];
