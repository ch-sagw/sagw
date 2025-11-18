import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';
import {
  Field, Option,
} from 'payload';

interface InterfaceFieldsColorMode {
  white: boolean;
  light: boolean;
  dark: boolean;
}

export const fieldsColorMode = ({
  white,
  light,
  dark,
}: InterfaceFieldsColorMode): Field => {
  const options: Option[] = [];

  if (white) {
    options.push({
      label: 'White',
      value: 'white',
    });
  }

  if (dark) {
    options.push({
      label: 'Dark',
      value: 'dark',
    });
  }

  if (light) {
    options.push({
      label: 'Light',
      value: 'light',
    });
  }

  return {
    access: fieldAccessNonLocalizableField,
    defaultValue: 'white',
    label: 'Color Mode',
    name: 'colorMode',
    options,
    required: true,
    type: 'radio',
  };
};
