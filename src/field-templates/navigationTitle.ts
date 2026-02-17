import { Field } from 'payload';

export const fieldNavigationTitleFieldName = 'navigationTitle';

export const fieldNavigationTitle: Field = {
  admin: {
    description: 'Used as the title in the breadcrumb.',
    position: 'sidebar',
  },
  localized: true,
  name: fieldNavigationTitleFieldName,
  required: true,
  type: 'text',
};
