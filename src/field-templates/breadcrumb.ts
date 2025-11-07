import { Field } from 'payload';

export const fieldBreadcrumbFieldName = 'breadcrumb';

export const fieldBreadcrumb: Field = {
  admin: {
    position: 'sidebar',
    readOnly: true,
  },
  fields: [
    {
      localized: true,
      name: 'slug',
      required: true,
      type: 'text',
    },
    {
      name: 'documentId',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'name',
      required: true,
      type: 'text',
    },
  ],
  interfaceName: 'InterfaceBreadcrumb',
  minRows: 0,
  name: fieldBreadcrumbFieldName,
  type: 'array',
};

