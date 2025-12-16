import { Field } from 'payload';

export const fieldBreadcrumbFieldName = 'breadcrumb';

export const BREADCRUMB_SLUG_PREFIX = 'slug';
export const BREADCRUMB_NAME_PREFIX = 'name';

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
      name: `${BREADCRUMB_NAME_PREFIX}de`,
      required: false,
      type: 'text',
    },
    {
      name: `${BREADCRUMB_NAME_PREFIX}fr`,
      required: false,
      type: 'text',
    },
    {
      name: `${BREADCRUMB_NAME_PREFIX}it`,
      required: false,
      type: 'text',
    },
    {
      name: `${BREADCRUMB_NAME_PREFIX}en`,
      required: false,
      type: 'text',
    },
    {
      name: `${BREADCRUMB_SLUG_PREFIX}de`,
      required: false,
      type: 'text',
    },
    {
      name: `${BREADCRUMB_SLUG_PREFIX}fr`,
      required: false,
      type: 'text',
    },
    {
      name: `${BREADCRUMB_SLUG_PREFIX}it`,
      required: false,
      type: 'text',
    },
    {
      name: `${BREADCRUMB_SLUG_PREFIX}en`,
      required: false,
      type: 'text',
    },
  ],
  interfaceName: 'InterfaceBreadcrumb',
  minRows: 0,
  name: fieldBreadcrumbFieldName,
  type: 'array',
};

