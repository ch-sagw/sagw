import { Block } from 'payload';

import {
  formFieldCheckbox, formFieldError, formFieldLabel, formFieldName, formFieldPlacehodler, formFieldWidth,
} from '@/blocks/Form/DefaultFields';

// Only available on forms block

export const emailBlock = (isForNewsletter?: boolean): Block => {
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
    interfaceName: 'InterfaceEmailField',
    labels: {
      plural: 'Email',
      singular: 'Email',
    },
    slug: 'emailBlock',
  };
};
