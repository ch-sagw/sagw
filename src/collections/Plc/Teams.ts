import { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';

export const Teams: CollectionConfig = {
  admin: {
    defaultColumns: ['name'],
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
    {
      admin: {
        allowCreate: false,
      },
      collection: 'people',
      name: 'relatedPeople',
      on: 'team',
      type: 'join',
    },
  ],
  slug: 'teams',
  versions,
};
