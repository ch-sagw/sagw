import { CollectionConfig } from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsHeroHome } from '@/field-templates/hero';
import { fieldLinkablePage } from '@/field-templates/linkablePage';
import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { blocks } from '@/blocks';
import { versions } from '@/field-templates/versions';

export const HomePage: CollectionConfig = {
  access: {
    create: (): boolean => true,
    delete: (): boolean => true,
    read: (): boolean => true,
    update: (): boolean => true,
  },
  admin: {
    group: 'Pages',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldLinkablePage,
    fieldAdminTitleDefaultValue('Home Page'),
    {
      tabs: [

        // Content Tab
        {
          fields: [
            fieldsHeroHome,

            // Content Blocks
            {
              blockReferences: blocks(),
              blocks: [],
              label: 'Content',
              name: 'content',
              type: 'blocks',
            },
          ],
          label: 'Content',
        },

        // Meta Tab
        fieldsTabMeta,
      ],
      type: 'tabs',
    },
  ],
  labels: {
    plural: 'Home',
    singular: 'Home',
  },
  slug: 'homePage',
  versions,
};
