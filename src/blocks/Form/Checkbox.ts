import { Block } from 'payload';

import {
  formFieldCheckbox, formFieldError, formFieldName, formFieldWidth,
} from '@/blocks/Form/DefaultFields';
import { rte2 } from '@/field-templates/rte';

// Only available on forms block

export const checkboxBlock = (): Block => ({
  admin: {
    disableBlockName: true,
  },
  fields: [
    formFieldName,
    rte2({
      name: 'label',
      required: true,
    }),
    {
      fields: [
        formFieldWidth,
        formFieldCheckbox,
      ],
      type: 'row',
    },
    formFieldError,
  ],
  labels: {
    plural: 'Checkbox',
    singular: 'Checkbox',
  },
  slug: 'checkboxBlock',
});
