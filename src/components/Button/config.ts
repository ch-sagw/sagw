import type { Field } from 'payload';

export const ButtonConfig: Field[] = [
  {
    name: 'primary',
    type: 'checkbox',
  },
  {
    name: 'label',
    required: true,
    type: 'text',
  },
  {
    defaultValue: 'medium',
    name: 'size',
    options: [
      {
        label: 'Small',
        value: 'small',
      },
      {
        label: 'Medium',
        value: 'medium',
      },
      {
        label: 'Large',
        value: 'large',
      },
    ],
    type: 'select',
  },
  {
    defaultValue: 'white',
    name: 'backgroundColor',
    options: [
      {
        label: 'White',
        value: 'white',
      },
      {
        label: 'Gray',
        value: 'gray',
      },
    ],
    type: 'select',
  },
];
