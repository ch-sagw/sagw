import { Field } from 'payload';
import { formFieldNameFromLabel } from '@/hooks-payload/formFieldNameFromLabel';

export const formFieldName: Field = {
  access: {
    // visible in API
    read: () => true,

    // writable from hooks
    update: () => true,
  },
  admin: {
    hidden: true,
    readOnly: true,
  },
  hooks: {
    beforeValidate: [formFieldNameFromLabel],
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
  defaultValue: 'half',
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
