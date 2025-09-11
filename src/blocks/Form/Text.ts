import { Block } from 'payload';

import {
  formFieldCheckbox, formFieldError, formFieldLabel, formFieldName, formFieldPlacehodler, formFieldWidth,
} from '@/blocks/Form/DefaultFields';

// Only available on forms block

export const textBlock = (hideWidthAndRequired?: boolean): Block => ({
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
      admin: {
        hidden: hideWidthAndRequired,
      },
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
  slug: 'textBlockForm',
});
