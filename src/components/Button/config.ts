import type { Field } from 'payload';

export const ButtonConfig: Field[] = [
  {
    name: 'primary',
    required: true,
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
];
