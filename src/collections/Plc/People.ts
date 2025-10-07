import type { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';

export const memberTypeConfig = {
  executiveBoard: {
    label: 'Vorstand',
    value: 'executiveBoard',
  },
  team: {
    label: 'Team',
    value: 'team',
  },
};

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
    {
      localized: true,
      name: 'prefix',
      required: false,
      type: 'text',
    },
    {
      name: 'firstname',
      required: true,
      type: 'text',
    },
    {
      name: 'middleName',
      required: false,
      type: 'text',
    },
    {
      name: 'lastname',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'function',
      required: false,
      type: 'text',
    },
    {
      name: 'mail',
      required: true,
      type: 'email',
    },
    {
      name: 'phone',
      required: false,
      type: 'text',
    },
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
