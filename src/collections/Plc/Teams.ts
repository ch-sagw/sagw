import { CollectionConfig } from 'payload';
import { rte1 } from '@/field-templates/rte';
import { globalContentAccessGeneric } from '@/access/globalContent';
import {
  hookInvalidateTenantCache, hookInvalidateTenantCacheOnDelete,
} from '@/hooks-payload/invalidateTenantCache';
import { lockDocuments } from '@/field-templates/lockDocuments';

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
    afterChange: [hookInvalidateTenantCache],
    afterDelete: [hookInvalidateTenantCacheOnDelete],
  },
  lockDocuments,
  slug: 'teams',
};
