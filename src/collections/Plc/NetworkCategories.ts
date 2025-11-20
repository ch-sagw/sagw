import { CollectionConfig } from 'payload';
import { rte1 } from '@/field-templates/rte';
import { globalContentAccessGeneric } from '@/access/globalContent';

export const NetworkCategories: CollectionConfig = {
  access: globalContentAccessGeneric,
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
