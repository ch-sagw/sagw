import { Field } from 'payload';
import { formFieldNameFromLabel } from '@/hooks-payload/formFieldNameFromLabel';
import { rte1 } from '@/field-templates/rte';

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

export const formFieldLabel: Field = rte1({
  name: 'label',
});

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
  ...rte1({
    adminCondition: (_, siblingData) => siblingData.required === true,
    name: 'fieldError',
  }),
};
