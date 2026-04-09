import { fieldsLinkInternalWithToggle } from '@/field-templates/links';
import { CollectionConfig } from 'payload';

import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { rte1 } from '@/field-templates/rte';
import { globalContentAccessGeneric } from '@/access/globalContent';
import {
  hookInvalidateTenantCache, hookInvalidateTenantCacheOnDelete,
} from '@/hooks-payload/invalidateTenantCache';

export const StatusMessage: CollectionConfig = {
  access: globalContentAccessGeneric,
  admin: {
    group: 'Global Content',
    hideAPIURL: process.env.ENV === 'prod',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldAdminTitleDefaultValue('Status Message'),
    {
      fields: [
        {
          fields: [
            {
              admin: {
                description: 'Show, hide or define date range when to show the message.',
              },
              defaultValue: 'hide',
              name: 'display',
              options: [
                {
                  label: 'Show',
                  value: 'show',
                },
                {
                  label: 'Hide',
                  value: 'hide',
                },
              ],
              required: true,
              type: 'select',
            },
          ],
          name: 'show',
          type: 'group',
        },
        rte1({
          name: 'title',
        }),
        rte1({
          name: 'message',
        }),
        fieldsLinkInternalWithToggle({}),
        {
          admin: {
            description: 'Should the message be displayed on home only or everywhere?',
          },
          defaultValue: false,
          label: 'On Home only',
          name: 'showOnHomeOnly',
          type: 'checkbox',
        },
        {
          admin: {
            description: 'Your choice affects the color of the message.',
          },
          defaultValue: 'warn',
          name: 'type',
          options: [
            {
              label: 'Warn',
              value: 'warn',
            },
            {
              label: 'Error',
              value: 'error',
            },
            {
              label: 'Success',
              value: 'success',
            },
          ],
          required: true,
          type: 'select',
        },
      ],
      interfaceName: 'InterfaceStatusMessage',
      label: '',
      name: 'content',
      type: 'group',
    },
  ],
  hooks: {
    afterChange: [hookInvalidateTenantCache],
    afterDelete: [hookInvalidateTenantCacheOnDelete],
  },
  labels: {
    plural: 'Status Message',
    singular: 'Status Message',
  },
  slug: 'statusMessage',
};
