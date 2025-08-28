import {
  Field, GroupField,
} from 'payload';
import { rte1 } from '@/field-templates/rte';

export const fieldsHero = (additionalFields?: Field[]): GroupField => ({

  fields: [
    {
      editor: rte1,
      localized: true,
      name: 'title',
      required: true,
      type: 'richText',
    },
    {
      localized: true,
      name: 'lead',
      required: false,
      type: 'text',
    },
    ...additionalFields || [],
  ],
  label: 'Hero',
  name: 'hero',
  type: 'group',
});
