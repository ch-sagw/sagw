import { CollectionConfig } from 'payload';
import { rte1 } from '@/field-templates/rte';
import { globalContentAccessGeneric } from '@/access/globalContent';
import {
  hookInvalidateCacheOnReferencedCollectionChange,
  hookInvalidateCacheOnReferencedCollectionDelete,
} from '@/hooks-payload/invalidateCacheOnReferencedCollectionChange';

export const Teams: CollectionConfig = {
  access: globalContentAccessGeneric,
  admin: {
    defaultColumns: ['name'],
    description: 'You can assign People to teams.',
    group: 'Global Content',
    hideAPIURL: process.env.ENV === 'prod',
    useAsTitle: 'name',
  },
  fields: [
    rte1({
      name: 'name',
    }),
    {
      admin: {
        description: 'Add People who belong to the team. The order represents the order of the people on the website.',
      },
      hasMany: true,
      name: 'people',
      relationTo: 'people',
      type: 'relationship',
    },
  ],
  hooks: {
    afterChange: [hookInvalidateCacheOnReferencedCollectionChange],
    afterDelete: [hookInvalidateCacheOnReferencedCollectionDelete],
  },
  slug: 'teams',
};
