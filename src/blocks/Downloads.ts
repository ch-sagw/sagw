import { Block } from 'payload';
import { rte1 } from '@/field-templates/rte';
import { fieldsLinkInternalWithToggle } from '@/field-templates/links';

// Example: Publication Detail

export const DownloadsBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte1({
      name: 'subtitle',
      notRequired: true,
    }),
    fieldsLinkInternalWithToggle,
    {
      defaultValue: 'custom',
      name: 'customOrAuto',
      options: [
        {
          label: 'I want to add custom documents',
          value: 'custom',
        },
        {
          label: 'I want to add documents from a specific project automatically',
          value: 'auto',
        },
      ],
      required: true,
      type: 'radio',
    },
    {
      admin: {
        condition: (_, siblingData): boolean => siblingData.customOrAuto === 'custom',
      },
      hasMany: true,
      label: 'Select documents to add',
      name: 'downloads',
      relationTo: [
        'documents',
        'zenodoDocuments',
      ],
      required: true,
      type: 'relationship',
    },
    {
      admin: {
        condition: (_, siblingData): boolean => siblingData.customOrAuto === 'auto',
      },
      hasMany: false,
      label: 'Select the project from which you want to show the downloads',
      name: 'project',
      relationTo: 'projects',
      required: true,
      type: 'relationship',
    },
  ],
  imageURL: '/admin-ui-images/downloads.svg',
  interfaceName: 'InterfaceDownloadsBlock',
  labels: {
    plural: 'Downloads',
    singular: 'Downloads',
  },
  slug: 'downloadsBlock',
} as const satisfies Block;
