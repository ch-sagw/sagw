import { Field } from 'payload';

export const fieldsColorScheme: Field = {
  defaultValue: 'bright',
  label: 'Color Scheme',
  localized: false,
  name: 'colorScheme',
  options: [
    {
      label: 'bright',
      value: 'bright',
    },
    {
      label: 'dark',
      value: 'dark',
    },
  ],
  required: true,
  type: 'select',
};

export const fieldsColorMode: Field[] = [
  {
    defaultValue: 'color',
    label: 'Color Mode',
    name: 'colorMode',
    options: [
      {
        label: 'White',
        value: 'white',
      },
      {
        label: 'Color',
        value: 'color',
      },
    ],
    required: true,
    type: 'select',
  },
  {
    admin: {
      condition: (_, siblingData) => siblingData.colorMode === 'color',
    },
    ...fieldsColorScheme,
  },
];
