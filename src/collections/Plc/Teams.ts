import { CollectionConfig } from 'payload';
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
    }),
    {
      hasMany: true,
      name: 'people',
      relationTo: 'people',
      type: 'relationship',
    },
  ],
  slug: 'teams',
};
