import { Field } from 'payload';

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
  name: 'adminTitle',
  type: 'text',
};
