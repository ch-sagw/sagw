import { Block } from 'payload';
import { SubpageSectionBlock } from '@/blocks/SubpageSectionBlock';

export const SubpageSection: Block = {
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'lead',
      required: true,
      type: 'text',
    },
    {
      defaultValue: 'vertical',
      name: 'alignement',
      options: [
        {
          label: 'vertical',
          value: 'vertical',
        },
        {
          label: 'horizontal',
          value: 'horizontal',
        },
      ],
      type: 'select',
    },
    {
      blocks: [SubpageSectionBlock],
      minRows: 1,
      name: 'blocks',
      required: true,
      type: 'blocks',
    },
  ],
  slug: 'subpageSection',
};
