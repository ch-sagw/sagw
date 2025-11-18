import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';
import { Field } from 'payload';

export const alignementHorizontalVertical: Field = ({
  access: fieldAccessNonLocalizableField,
  admin: {
    description: 'Align Title & text horizontally or vertically',
  },
  defaultValue: 'vertical',
  name: 'alignement',
  options: [
    {
      label: 'vertical',
      value: 'vertical',
    },
    {
      label: 'horizontal',
      value: 'horizontal',
    },
  ],
  type: 'select',
});
