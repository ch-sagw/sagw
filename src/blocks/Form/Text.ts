import { Block } from 'payload';

import {
  formFieldCheckbox, formFieldError, formFieldLabel, formFieldName, formFieldPlacehodler, formFieldWidth,
} from '@/blocks/Form/DefaultFields';

// Only available on forms block

export const TextBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      fields: [
        formFieldName,
        formFieldLabel,
        formFieldPlacehodler,
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
    formFieldError,
  ],
  labels: {
    plural: 'Text',
    singular: 'Text',
  },
  slug: 'textBlock',
};
