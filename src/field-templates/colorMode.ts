import {
  fieldAccessAdminsOnly, fieldAccessNonLocalizableField,
} from '@/access/fields/localizedFields';
import {
  Field, Option,
} from 'payload';

interface InterfaceFieldsColorMode {
  white: boolean;
  light: boolean;
  dark: boolean;
  adminOnly?: boolean;
}

export const fieldsColorMode = ({
  white,
  light,
  dark,
  adminOnly,
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
    access: adminOnly
      ? fieldAccessAdminsOnly
      : fieldAccessNonLocalizableField,
    defaultValue: 'white',
    label: 'Color Mode',
    name: 'colorMode',
    options,
    required: true,
    type: 'radio',
  };
};
