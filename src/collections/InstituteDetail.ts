import {
  CollectionBeforeValidateHook, CollectionConfig,
} from 'payload';
import { fieldsTabMeta } from '@/field-templates/meta';
import { fieldsColorMode } from '@/field-templates/colorMode';
import { fieldsLinkInternalOrExternal } from '@/field-templates/links';

const syncHeroTitleToTopLevel: CollectionBeforeValidateHook = ({
  data,
}) => {
  if (data?.hero?.title) {
    data.title = data.hero.title;
  }

  return data;
};

export const InstituteDetailConfig: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Pages',
    useAsTitle: 'title',
  },
  fields: [
    {
      admin: {
        hidden: true,
      },
      name: 'title',
      type: 'text',
    },
    {
      tabs: [

        // Content Tab
        {
          fields: [

            // Hero
            {
              fields: [
                {
                  localized: true,
                  name: 'title',
                  required: true,
                  type: 'text',
                },
                ...fieldsColorMode,
              ],
              label: 'Hero',
              name: 'hero',
              type: 'group',
            },

            // Institute Details
            {
              fields: [
                {
                  localized: true,
                  name: 'title',
                  required: true,
                  type: 'text',
                },
                {
                  localized: true,
                  name: 'text',
                  required: true,
                  type: 'text',
                },
                {
                  name: 'logo',
                  relationTo: 'images',
                  required: true,
                  type: 'relationship',
                },
                ...fieldsLinkInternalOrExternal,
              ],
              label: 'Institute Details',
              name: 'instituteDetails',
              type: 'group',
            },

          ],
          label: 'Content',
        },

        // Meta Tabs
        fieldsTabMeta,
      ],
      type: 'tabs',
    },
  ],
  hooks: {
    beforeChange: [syncHeroTitleToTopLevel],
  },
  labels: {
    plural: 'Institute Detail Pages',
    singular: 'Institute Detail',
  },
  slug: 'instituteDetail',
};
