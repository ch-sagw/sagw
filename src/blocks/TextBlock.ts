import { Block } from 'payload';
import { rte2 } from '@/field-templates/rte';

export const TextBlock: Block = {
  fields: [
    {
      editor: rte2,
      localized: true,
      name: 'title',
      required: false,
      type: 'richText',
    },

    // TODO: only show on publication detail, not configurable
    {
      defaultValue: false,
      name: 'showCopyTextButton',
      type: 'checkbox',
    },
  ],
  slug: 'textBlock',
};
