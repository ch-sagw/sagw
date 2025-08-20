import {
  Field, GroupField,
} from 'payload';
import { fieldsLinkInternalWithToggle } from './links';
import { fieldsColorScheme } from '@/field-templates/colorMode';

const fieldsFormResponse: GroupField = {
  fields: [
    fieldsLinkInternalWithToggle,
    fieldsColorScheme,
  ],
  label: 'Form Response',
  name: 'formResponse',
  type: 'group',
};

export const fieldsContactForm: Field[] = [
  {
    localized: true,
    name: 'buttonText',
    required: true,
    type: 'text',
  },
  {
    localized: true,
    name: 'text',
    required: true,
    type: 'text',
  },
  {
    localized: true,
    name: 'title',
    required: true,
    type: 'text',
  },
  fieldsFormResponse,
];
