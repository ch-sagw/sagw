import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';
import {
  rte1, rte2,
} from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Magazine Detail

export const VideoBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      access: fieldAccessNonLocalizableField,
      name: 'video-de',
      relationTo: 'videos',
      required: true,
      type: 'relationship',
    },
    {
      access: fieldAccessNonLocalizableField,
      name: 'video-fr',
      relationTo: 'videos',
      required: false,
      type: 'relationship',
    },
    {
      access: fieldAccessNonLocalizableField,
      name: 'video-it',
      relationTo: 'videos',
      required: false,
      type: 'relationship',
    },
    {
      access: fieldAccessNonLocalizableField,
      name: 'video-en',
      relationTo: 'videos',
      required: false,
      type: 'relationship',
    },
    rte2({
      name: 'caption',
      notRequired: true,
    }),
    rte1({
      adminDescription: 'The © will be added automatically in front of this text.',
      name: 'credits',
    }),
    {
      access: fieldAccessNonLocalizableField,
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
