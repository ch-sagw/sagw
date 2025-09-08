import { Field } from 'payload';

export const formFieldName: Field = {
  admin: {
    description: 'lowercase, no special characters',
  },
  localized: true,
  name: 'name',
  required: true,
  type: 'text',
};

export const formFieldLabel: Field = {
  localized: true,
  name: 'label',
  required: true,
  type: 'text',
};

export const formFieldPlacehodler: Field = {
  localized: true,
  name: 'placeholder',
  required: true,
  type: 'text',
};

export const formFieldWidth: Field = {
  defaultValue: 'full',
  name: 'fieldWidth',
  options: [
    {
      label: 'full width',
      value: 'full',
    },
    {
      label: 'half width',
      value: 'half',
    },
  ],
  required: true,
  type: 'select',
};

export const formFieldCheckbox: Field = {
  defaultValue: true,
  name: 'required',
  type: 'checkbox',
};

export const formFieldError: Field = {
  admin: {
    condition: (_, siblingData) => siblingData.required === true,
  },
  localized: true,
  name: 'fieldError',
  required: true,
  type: 'text',
};
