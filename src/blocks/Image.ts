import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';
import {
  rte1, rte2,
} from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Magazine Detail

const alignementOptions = [
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
];

const alignementOptionsMagazineDetail = [
  ...alignementOptions,
  {
    label: 'Hero',
    value: 'hero',
  },
];

export const ImageBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      access: fieldAccessNonLocalizableField,
      name: 'image',
      relationTo: 'images',
      required: true,
      type: 'relationship',
    },
    {
      access: fieldAccessNonLocalizableField,
      admin: {
        condition: (data): boolean => data.hero?.author && data.hero?.date,
      },
      defaultValue: 'center',
      name: 'alignmentMagazine',
      options: alignementOptionsMagazineDetail,
      type: 'select',
    },
    {
      access: fieldAccessNonLocalizableField,
      admin: {
        condition: (data): boolean => !(data.hero?.author && data.hero?.date),
      },
      defaultValue: 'center',
      name: 'alignment',
      options: alignementOptions,
      type: 'select',
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
