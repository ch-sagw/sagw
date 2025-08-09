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
      name: 'text',
      required: true,
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
    ...fieldsLinkExternal,
  ],
  slug: 'events',
};
