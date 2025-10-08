import { rte1 } from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Magazine Detail

export const VideoBlock = {
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
    rte1({
      name: 'caption',
      notRequired: true,
    }),
    rte1({
      name: 'credits',
    }),
    {
      name: 'stillImage',
      relationTo: 'images',
      required: true,
      type: 'relationship',
    },

  ],
  imageURL: '/admin-ui-images/video.svg',
  interfaceName: 'InterfaceVideoBlock',
  labels: {
    plural: 'Videos',
    singular: 'Video',
  },
  slug: 'videoBlock',
} as const satisfies Block;
