import { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';

export const Teams: CollectionConfig = {
  admin: {
    description: 'You can assign People to teams.',
    group: 'Global Content',
    useAsTitle: 'name',
  },
  fields: [
    {
      localized: true,
      name: 'name',
      required: true,
      type: 'text',
    },
  ],
  slug: 'teams',
  versions,
};
