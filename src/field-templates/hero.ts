import {
  Field, GroupField,
} from 'payload';
import { rte1 } from '@/field-templates/rte';
import { fieldsColorMode } from '@/field-templates/colorMode';

export const fieldsHero = (hideColorMode: boolean, additionalFields?: Field[]): GroupField => {

  let colorMode: Field[] = [];

  if (!hideColorMode) {
    colorMode = fieldsColorMode({
      dark: true,
      light: true,
      white: true,
    });
  }

  return {
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
      ...colorMode,
      ...additionalFields || [],
    ],
    label: 'Hero',
    name: 'hero',
    type: 'group',
  };
};
