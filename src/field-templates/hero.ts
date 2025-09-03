import {
  Field, GroupField,
} from 'payload';
import { rte1 } from '@/field-templates/rte';

export const fieldsHero = (additionalFields?: Field[]): GroupField => ({
  fields: [
    rte1({
      name: 'title',
      required: true,
    }),
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
