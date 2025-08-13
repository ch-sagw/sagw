import { Field } from 'payload';

export const fieldLinkablePage: Field = {
  admin: {
    hidden: true,
  },
  defaultValue: true,
  name: 'isLinkable',
  type: 'checkbox',
};
