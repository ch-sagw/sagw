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
  localized: true,
  name: fieldAdminTitleFieldName,
  type: 'text',
};

export const fieldAdminTitleDefaultValue = (defaultValue: string): Field => ({
  admin: {
    hidden: true,
    readOnly: true,
  },
  defaultValue,
  name: fieldAdminTitleFieldName,
  type: 'text',
});
