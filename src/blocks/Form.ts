import { Block } from 'payload';

// Example: Activities

export const FormBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      hasMany: false,
      name: 'form',
      relationTo: 'forms',
      type: 'relationship',
    },
  ],
  imageURL: '/admin-ui-images/form.svg',
  labels: {
    plural: 'Forms',
    singular: 'Form',
  },
  slug: 'formBlock',
};
