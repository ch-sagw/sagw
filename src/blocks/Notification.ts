import { Block } from 'payload';
import { rte3 } from '@/field-templates/rte';

// Example: Publication Overview Page

export const NotificationBlock: Block = {
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
};
