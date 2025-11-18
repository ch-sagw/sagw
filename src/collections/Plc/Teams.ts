import { CollectionConfig } from 'payload';
import { rte1 } from '@/field-templates/rte';
import { globalContentAccessGeneric } from '@/access/globalContent';

export const Teams: CollectionConfig = {
  access: globalContentAccessGeneric,
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
