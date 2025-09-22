import { Block } from 'payload';

import {
  formFieldCheckbox, formFieldError, formFieldLabel, formFieldName, formFieldPlacehodler, formFieldWidth,
} from '@/blocks/Form/DefaultFields';

// Only available on forms block

export const textareaBlock = (): Block => ({
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
  interfaceName: 'InterfaceTextTextarea',
  labels: {
    plural: 'Textarea',
    singular: 'Textarea',
  },
  slug: 'textareaBlock',
});
