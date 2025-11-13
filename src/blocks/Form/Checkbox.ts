import { Block } from 'payload';

import {
  formFieldCheckbox, formFieldError, formFieldName, formFieldWidth,
} from '@/blocks/Form/DefaultFields';
import { rte3 } from '@/field-templates/rte';

// Only available on forms block

export const checkboxBlock = (): Block => ({
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
      name: 'defaultChecked',
      type: 'checkbox',
    },
  ],
  interfaceName: 'InterfaceCheckboxField',
  labels: {
    plural: 'Checkbox',
    singular: 'Checkbox',
  },
  slug: 'checkboxBlock',
});
