import { Field } from 'payload';

export const fieldBreadcrumbFieldName = 'breadcrumb';

export const fieldBreadcrumb: Field = {
  admin: {
    hidden: true,
    position: 'sidebar',
    readOnly: true,
  },
  fields: [
    {
      name: 'documentId',
      required: true,
      type: 'text',
    },
    {
      name: 'namede',
      required: true,
      type: 'text',
    },
    {
      name: 'namefr',
      required: false,
      type: 'text',
    },
    {
      name: 'nameit',
      required: false,
      type: 'text',
    },
    {
      name: 'nameen',
      required: false,
      type: 'text',
    },
    {
      name: 'slugde',
      required: true,
      type: 'text',
    },
    {
      name: 'slugfr',
      required: false,
      type: 'text',
    },
    {
      name: 'slugit',
      required: false,
      type: 'text',
    },
    {
      name: 'slugen',
      required: false,
      type: 'text',
    },
  ],
  interfaceName: 'InterfaceBreadcrumb',
  minRows: 0,
  name: fieldBreadcrumbFieldName,
  type: 'array',
};

