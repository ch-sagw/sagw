import { Field } from 'payload';

export const fieldAdminTitleFieldName = 'adminTitle';

export const fieldAdminTitle: Field = {
  access: {
    read: () => true,
    update: () => true,
  },
  admin: {
    hidden: true,
    readOnly: true,
  },
  localized: true,
  name: fieldAdminTitleFieldName,
  type: 'text',
  unique: false,
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
