import { Field } from 'payload';

export const fieldAdminTitleFieldName = 'adminTitle';

export const fieldAdminTitle: Field = {
  access: {
    // visible in API
    read: () => true,

    // writable from hooks
    update: () => true,
  },
  admin: {
    hidden: true,
    readOnly: true,
  },
  name: fieldAdminTitleFieldName,
  type: 'text',
};
