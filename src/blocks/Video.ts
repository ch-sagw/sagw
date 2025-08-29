import { Block } from 'payload';

export const VideoBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      name: 'video',
      relationTo: 'videos',
      required: true,
      type: 'relationship',
    },
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'caption',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'credits',
      required: true,
      type: 'text',
    },
    {
      name: 'stillImage',
      relationTo: 'images',
      required: true,
      type: 'relationship',
    },

  ],
  labels: {
    plural: 'Videos',
    singular: 'Video',
  },
  slug: 'videoBlock',
};
