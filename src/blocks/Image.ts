import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';
import {
  rte1, rte2,
} from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Magazine Detail

export const ImageBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      access: fieldAccessNonLocalizableField,
      defaultValue: 'center',
      name: 'alignment',
      options: [
        {
          label: 'Links',
          value: 'left',
        },
        {
          label: 'Mitte',
          value: 'center',
        },
        {
          label: 'Rechts',
          value: 'right',
        },
      ],
      type: 'select',
    },
    {
      access: fieldAccessNonLocalizableField,
      name: 'image',
      relationTo: 'images',
      required: true,
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
  ],
  imageURL: '/admin-ui-images/image.svg',
  interfaceName: 'InterfaceImageBlock',
  labels: {
    plural: 'Images',
    singular: 'Image',
  },
  slug: 'imageBlock',
} as const satisfies Block;
