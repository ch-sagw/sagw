import { Block } from 'payload';

import {
  formFieldCheckbox, formFieldError, formFieldName, formFieldWidth,
} from '@/blocks/Form/DefaultFields';
import { rte3 } from '@/field-templates/rte';

// Only available on forms block

export const radioBlock = (): Block => ({
  admin: {
    disableBlockName: true,
  },
  fields: [
    formFieldName,
    rte3({
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
        {
          localized: true,
          name: 'label',
          required: true,
          type: 'text',
        },
        {
          admin: {
            description: 'lowercase, no spaces, no special characters',
          },
          localized: true,
          name: 'value',
          required: true,
          type: 'text',
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
