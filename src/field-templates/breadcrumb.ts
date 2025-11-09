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
      required: true,
      type: 'text',
    },
    {
      name: 'nameit',
      required: true,
      type: 'text',
    },
    {
      name: 'nameen',
      required: true,
      type: 'text',
    },
    {
      name: 'slugde',
      required: true,
      type: 'text',
    },
    {
      name: 'slugfr',
      required: true,
      type: 'text',
    },
    {
      name: 'slugit',
      required: true,
      type: 'text',
    },
    {
      name: 'slugen',
      required: true,
      type: 'text',
    },
  ],
  interfaceName: 'InterfaceBreadcrumb',
  minRows: 0,
  name: fieldBreadcrumbFieldName,
  type: 'array',
};

