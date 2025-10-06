import { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';
import { rte1 } from '@/field-templates/rte';

export const Teams: CollectionConfig = {
  admin: {
    defaultColumns: ['name'],
    description: 'You can assign People to teams.',
    group: 'Global Content',
    useAsTitle: 'name',
  },
  fields: [
    rte1({
      name: 'name',
      required: true,
    }),
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
