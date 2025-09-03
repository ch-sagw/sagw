import { Block } from 'payload';
import { rte2 } from '@/field-templates/rte';

// Example: Publication Overview Page

export const NotificationBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      editor: rte2,
      localized: true,
      name: 'text',
      required: true,
      type: 'richText',
    },
  ],
  imageURL: '/admin-ui-images/notification.svg',
  labels: {
    plural: 'Notifications',
    singular: 'Notification',
  },
  slug: 'notificationBlock',
};
