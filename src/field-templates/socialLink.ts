import { fieldsLinkExternal } from '@/field-templates/links';
import { Field } from 'payload';

export const fieldsSocialLink: Field[] = [
  ...fieldsLinkExternal,
  {
    name: 'icon',
    options: [
      {
        label: 'LinkedIn',
        value: 'linkedIn',
      },
      {
        label: 'X (Twitter)',
        value: 'twitter',
      },
      {
        label: 'Facebook',
        value: 'facebook',
      },
    ],
    type: 'select',
  },
];
