import { Block } from 'payload';

// Example: Publication Detail

export const DownloadsBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
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
      type: 'radio',
    },
    {
      admin: {
        condition: (_, siblingData) => siblingData.customOrAuto === 'custom',
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
        condition: (_, siblingData) => siblingData.customOrAuto === 'auto',
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
  labels: {
    plural: 'Downloads',
    singular: 'Downloads',
  },
  slug: 'downloadsBlock',
};
