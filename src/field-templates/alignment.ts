import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';
import { Field } from 'payload';

export const alignmentHorizontalVertical: Field = ({
  access: fieldAccessNonLocalizableField,
  admin: {
    description: 'Align Title and Lead horizontally or vertically',
  },
  defaultValue: 'vertical',
  name: 'alignment',
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
