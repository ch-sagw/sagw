import { CollectionConfig } from 'payload';
import { ButtonGroup } from '@/blocks/ButtonGroup/config';

export const Pages: CollectionConfig<'pages'> = {
  access: {
    read: () => true,
  },
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      blocks: [ButtonGroup],
      name: 'elements',
      type: 'blocks',
    },
  ],
  slug: 'pages',
};
