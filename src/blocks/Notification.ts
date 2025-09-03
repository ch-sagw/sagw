import { Block } from 'payload';
import { rte2 } from '@/field-templates/rte';

// Example: Publication Overview Page

export const NotificationBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte2({
      name: 'text',
      required: true,
    }),
  ],
  imageURL: '/admin-ui-images/notification.svg',
  labels: {
    plural: 'Notifications',
    singular: 'Notification',
  },
  slug: 'notificationBlock',
};
