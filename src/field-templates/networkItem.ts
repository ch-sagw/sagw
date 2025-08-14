import { Field } from 'payload';

export const fieldsNetworkItem: Field[] = [
  {
    localized: true,
    name: 'title',
    required: true,
    type: 'text',
  },
  {
    name: 'category',
    relationTo: 'networkCategories',
    required: true,
    type: 'relationship',
  },
  {
    name: 'foundingYear',
    required: true,
    type: 'number',
  },
  {
    name: 'image',
    relationTo: 'images',
    required: true,
    type: 'upload',
  },
  {
    name: 'link',
    required: true,
    type: 'text',
  },
];
