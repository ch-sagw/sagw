import { fieldsLinkInternalWithToggle } from '@/field-templates/links';
import { CollectionConfig } from 'payload';

import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { rte1 } from '@/field-templates/rte';

export const StatusMessage: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Global Content',
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
                {
                  label: 'Date',
                  value: 'date',
                },
              ],
              required: true,
              type: 'select',
            },
            {
              admin: {
                condition: (_, siblingData) => siblingData.display === 'date',
              },
              name: 'from',
              required: true,
              type: 'date',
            },
            {
              admin: {
                condition: (_, siblingData) => siblingData.display === 'date',
              },
              name: 'to',
              required: true,
              type: 'date',
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
  labels: {
    plural: 'Status Message',
    singular: 'Status Message',
  },
  slug: 'statusMessage',
};
