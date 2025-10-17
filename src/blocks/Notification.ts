import { Block } from 'payload';
import { rte2 } from '@/field-templates/rte';

// Example: Publication Overview Page

export const NotificationBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      admin: {
        description: 'If disabled, the notification will not be shown.',
      },
      defaultValue: true,
      name: 'show',
      type: 'checkbox',
    },
    rte2({
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
