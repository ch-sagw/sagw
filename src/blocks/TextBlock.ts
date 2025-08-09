import { Block } from 'payload';

export const TextBlock: Block = {
  fields: [
    {
      localized: true,
      name: 'title',
      required: false,
      type: 'text',
    },
    {
      localized: true,
      name: 'text',
      required: true,
      type: 'richText',
    },
    {
      defaultValue: false,
      name: 'showCopyTextButton',
      type: 'checkbox',
    },
  ],
  slug: 'textBlock',
};
