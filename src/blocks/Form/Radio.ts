import { Block } from 'payload';

import {
  formFieldCheckbox, formFieldError, formFieldName, formFieldWidth,
} from '@/blocks/Form/DefaultFields';
import { rte1 } from '@/field-templates/rte';
import { formFieldNameFromLabel } from '@/hooks-payload/formFieldNameFromLabel';

// Only available on forms block

export const radioBlock = (): Block => ({
  admin: {
    disableBlockName: true,
  },
  fields: [
    formFieldName,
    rte1({
      label: 'Description',
      name: 'label',
    }),
    {
      fields: [
        formFieldWidth,
        formFieldCheckbox,
      ],
      type: 'row',
    },
    formFieldError,
    {
      fields: [
        rte1({
          label: 'Radio Button Label',
          name: 'label',
        }),
        {
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
          name: 'value',
          required: true,
          type: 'text',
        },
        {
          name: 'defaultChecked',
          type: 'checkbox',
        },
      ],
      name: 'items',
      required: true,
      type: 'array',
    },
  ],
  interfaceName: 'InterfaceRadioField',
  labels: {
    plural: 'Radio',
    singular: 'Radio',
  },
  slug: 'radioBlock',
});
