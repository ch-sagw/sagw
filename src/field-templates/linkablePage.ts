import { Field } from 'payload';

export const fieldLinkablePageFieldName = 'isLinkable';

export const fieldLinkablePage: Field = {
  admin: {
    hidden: true,
  },
  defaultValue: true,
  name: fieldLinkablePageFieldName,
  type: 'checkbox',
};
