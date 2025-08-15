import { fieldsLinkExternal } from '@/field-templates/links';
import { CollectionConfig } from 'payload';

export const Events: CollectionConfig = {
  admin: {
    group: 'Global Content',
    useAsTitle: 'title',
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
      name: 'location',
      required: false,
      type: 'text',
    },
    {
      localized: true,
      name: 'language',
      required: false,
      type: 'text',
    },
    {
      localized: true,
      name: 'time',
      required: false,
      type: 'text',
    },
    {
      name: 'category',
      relationTo: 'eventCategory',
      type: 'relationship',
    },
    {
      name: 'project',
      relationTo: 'projects',
      type: 'relationship',
    },
    {
      name: 'date',
      required: true,
      type: 'date',
    },
    {
      defaultValue: false,
      name: 'multipleDays',
      type: 'checkbox',
    },
    {
      admin: {
        condition: (data, siblingData) => siblingData.multipleDays,
      },
      name: 'dateEnd',
      required: true,
      type: 'date',
    },

    ...fieldsLinkExternal,
  ],
  slug: 'events',
};
