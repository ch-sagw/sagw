import {
  fieldAccessAdminsOnly, fieldAccessNonLocalizableField,
} from '@/access/fields/localizedFields';
import {
  Field, Option,
} from 'payload';

const colorValues = {
  dark: 'dark',
  light: 'light',
  white: 'white',
};

interface InterfaceFieldsColorMode {
  white: boolean;
  light: boolean;
  dark: boolean;
  adminOnly?: boolean;
  defaultColor?: keyof typeof colorValues;
}

export const fieldsColorMode = ({
  white,
  light,
  dark,
  adminOnly,
  defaultColor,
}: InterfaceFieldsColorMode): Field => {
  const options: Option[] = [];

  if (white) {
    options.push({
      label: 'White',
      value: colorValues.white,
    });
  }

  if (dark) {
    options.push({
      label: 'Dark',
      value: colorValues.dark,
    });
  }

  if (light) {
    options.push({
      label: 'Light',
      value: colorValues.light,
    });
  }

  return {
    access: adminOnly
      ? fieldAccessAdminsOnly
      : fieldAccessNonLocalizableField,
    defaultValue: defaultColor || colorValues.white,
    label: 'Color Mode',
    name: 'colorMode',
    options,
    required: true,
    type: 'radio',
  };
};
