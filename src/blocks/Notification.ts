import { Block } from 'payload';
import { rte3 } from '@/field-templates/rte';
import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';

// Example: Publication Overview Page

export const NotificationBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      access: fieldAccessNonLocalizableField,
      admin: {
        description: 'If disabled, the notification will not be shown.',
      },
      defaultValue: true,
      name: 'show',
      type: 'checkbox',
    },
    rte3({
      name: 'text',
    }),
  ],
  imageURL: '/admin-ui-images/notification.svg',
  interfaceName: 'InterfaceNotificationBlock',
  labels: {
    plural: 'Notifications',
    singular: 'Notification',
  },
  slug: 'notificationBlock',
} as const satisfies Block;
