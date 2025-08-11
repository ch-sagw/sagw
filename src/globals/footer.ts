import { GlobalConfig } from 'payload';

export const footerConfig: GlobalConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Global Content',
  },
  fields: [
    {
      admin: {
        hidden: true,
      },
      defaultValue: true,
      name: 'isLinkable',
      type: 'checkbox',
    },
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
  ],
  slug: 'footer',
};
