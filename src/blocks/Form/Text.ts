import { Block } from 'payload';

import {
  formFieldCheckbox, formFieldError, formFieldLabel, formFieldName, formFieldPlacehodler, formFieldWidth,
} from '@/blocks/Form/DefaultFields';

// Only available on forms block

export const textBlock = (isForNewsletter?: boolean): Block => {
  const fields = [
    formFieldLabel,
    formFieldPlacehodler,
  ];

  if (!isForNewsletter) {
    fields.push(formFieldName);
  }

  return {
    admin: {
      disableBlockName: true,
    },
    fields: [
      {
        fields,
        type: 'row',
      },
      {
        admin: {
          hidden: isForNewsletter,
        },
        fields: [
          formFieldWidth,
          formFieldCheckbox,
        ],
        type: 'row',
      },
      formFieldError,
    ],
    interfaceName: 'InterfaceTextField',
    labels: {
      plural: 'Text',
      singular: 'Text',
    },
    slug: 'textBlockForm',
  };
};
