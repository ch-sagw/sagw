import {
  Field, GroupField,
} from 'payload';
import { rte1 } from '@/field-templates/rte';

const FieldHeroTitle: Field = {
  editor: rte1,
  localized: true,
  name: 'title',
  required: true,
  type: 'richText',
};

export const fieldsHero = (additionalFields?: Field[]): GroupField => ({

  fields: [
    FieldHeroTitle,
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
