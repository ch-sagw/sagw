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
  ],
  imageURL: '/admin-ui-images/image.svg',
  interfaceName: 'InterfaceImageBlock',
  labels: {
    plural: 'Images',
    singular: 'Image',
  },
  slug: 'imageBlock',
};
