import { CollectionConfig } from 'payload';
import { rte1 } from '@/field-templates/rte';

export const NetworkCategories: CollectionConfig = {
  admin: {
    group: 'Global Content',
    useAsTitle: 'name',
  },
  fields: [
    rte1({
      name: 'name',
    }),
  ],
  slug: 'networkCategories',
};
