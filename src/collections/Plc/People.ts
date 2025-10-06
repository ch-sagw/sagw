import type { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';
import { rte1 } from '@/field-templates/rte';

export const People: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    group: 'Global Content',
    useAsTitle: 'fullName',
  },
  fields: [
    {
      hasMany: true,
      name: 'team',
      relationTo: 'teams',
      required: false,
      type: 'relationship',
    },

    rte1({
      name: 'prefix',
      required: false,
    }),
    rte1({
      disableLocalization: true,
      name: 'firstname',
      required: true,
    }),
    rte1({
      disableLocalization: true,
      name: 'middleName',
      required: false,
    }),
    rte1({
      disableLocalization: true,
      name: 'lastname',
      required: true,
    }),
    rte1({
      name: 'function',
      required: false,
    }),
    rte1({
      disableLocalization: true,
      name: 'mail',
      required: true,
    }),
    rte1({
      disableLocalization: true,
      name: 'phone',
      required: false,
    }),
    rte1({
      name: 'name',
      required: true,
    }),
    {
      name: 'image',
      relationTo: 'images',
      required: false,
      type: 'relationship',
    },
    {
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [
          ({
            data,
          }): string => {
            if (data?.firstname && data?.lastname) {
              return `${data.firstname} ${data.lastname}`;
            }

            return '';
          },
        ],
      },
      name: 'fullName',
      type: 'text',
    },
  ],
  labels: {
    plural: 'People',
    singular: 'People',
  },
  slug: 'people',
  versions,
};
