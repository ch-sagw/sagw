import { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';
import { rte1 } from '@/field-templates/rte';

export const NetworkCategories: CollectionConfig = {
  admin: {
    group: 'Global Content',
    useAsTitle: 'name',
  },
  fields: [
    rte1({
      name: 'name',
      required: true,
    }),
  ],
  slug: 'networkCategories',
  versions,
};
