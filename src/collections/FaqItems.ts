import { CollectionConfig } from 'payload';

export const FaqItems: CollectionConfig = {
  admin: {
    group: 'Global Content',
    useAsTitle: 'question',
  },
  fields: [
    {
      localized: true,
      name: 'question',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'answer',
      required: true,
      type: 'richText',
    },
  ],
  slug: 'faqItems',
};
