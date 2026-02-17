import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';
import {
  rte1, rte2,
} from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Magazine Detail

const alignmentOptions = [
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

const alignmentOptionsMagazineDetail = [
  ...alignmentOptions,
  {
    label: 'Hero',
    value: 'hero',
  },
];

const genericImageBlock = (isMagazine: boolean): Block => ({
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
      defaultValue: 'center',
      name: 'alignment',
      options: isMagazine
        ? alignmentOptionsMagazineDetail
        : alignmentOptions,
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
  interfaceName: isMagazine
    ? 'InterfaceImageBlockMagazine'
    : 'InterfaceImageBlock',
  labels: {
    plural: 'Images',
    singular: 'Image',
  },
  slug: isMagazine
    ? 'imageBlockMagazine'
    : 'imageBlock',
});

export const ImageBlock = genericImageBlock(false);
export const ImageBlockMagazine = genericImageBlock(true);
