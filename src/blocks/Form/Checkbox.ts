import { Block } from 'payload';

import {
  formFieldCheckbox, formFieldLabel, formFieldName, formFieldWidth,
} from '@/blocks/Form/DefaultFields';

// Only available on forms block

export const checkboxBlock = (): Block => ({
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      fields: [
        formFieldName,
        formFieldLabel,
      ],
      type: 'row',
    },
    {
      fields: [
        formFieldWidth,
        formFieldCheckbox,
      ],
      type: 'row',
    },
  ],
  labels: {
    plural: 'Checkbox',
    singular: 'Checkbox',
  },
  slug: 'checkboxBlock',
});
