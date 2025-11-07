import { Field } from 'payload';

export const fieldNavigationTitleFieldName = 'navigationTitle';

export const fieldNavigationTitle: Field = {
  admin: {
    description: 'Used as the title of this page in the breadcrumb.',
    position: 'sidebar',
  },
  localized: true,
  name: fieldNavigationTitleFieldName,
  required: false,
  type: 'text',
};
