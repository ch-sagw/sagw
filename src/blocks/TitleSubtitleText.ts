import { Block } from 'payload';

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
  labels: {
    plural: 'Title & Subtitle & Text',
    singular: 'Title & Subtitle & Text',
  },
  slug: 'titleSubtitleTextBlock',
};
