import { rte1 } from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Magazine Detail

export const ImageBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      defaultValue: 'center',
      name: 'alignement',
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
      name: 'image',
      relationTo: 'images',
      required: true,
      type: 'relationship',
    },
    rte1({
      name: 'caption',
      required: false,
    }),
    rte1({
      name: 'credits',
      required: true,
    }),
  ],
  imageURL: '/admin-ui-images/image.svg',
  interfaceName: 'InterfaceImageBlock',
  labels: {
    plural: 'Images',
    singular: 'Image',
  },
  slug: 'imageBlock',
};
