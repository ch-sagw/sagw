import { Block } from 'payload';

// Example: Early Career Award

export const TitleSubtitleTextBlock: Block = {
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
      localized: true,
      name: 'subtitle',
      required: true,
      type: 'text',
    },
    {
      fields: [
        {
          localized: true,
          name: 'text',
          required: true,
          type: 'textarea',
        },
      ],
      minRows: 1,
      name: 'textBlocks',
      required: true,
      type: 'array',
    },
  ],
  imageURL: '/admin-ui-images/title-subtitle-text.svg',
  interfaceName: 'InterfaceTitleSubtitleTextBlock',
  labels: {
    plural: 'Title & Subtitle & Text',
    singular: 'Title & Subtitle & Text',
  },
  slug: 'titleSubtitleTextBlock',
};
