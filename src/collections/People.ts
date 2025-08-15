import type { CollectionConfig } from 'payload';

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
      name: 'person-department',
      options: [
        {
          label: 'Adminstration',
          value: 'admin',
        },
        {
          label: 'Wissenschaftliche Mitarbeiter:in',
          value: 'science',
        },
        {
          label: 'Kommunikation',
          value: 'com',
        },
        {
          label: 'Geschäftsleitung',
          value: 'direction',
        },
      ],
      required: true,
      type: 'select',
    },
    {
      name: 'memberType',
      options: [
        {
          label: 'Vorstand',
          value: 'executiveBoard',
        },
        {
          label: 'Team',
          value: 'team',
        },
      ],
      required: true,
      type: 'select',
    },
    {
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
      required: true,
      type: 'text',
    },
    {
      name: 'mail',
      required: true,
      type: 'email',
    },
    {
      name: 'phone',
      required: true,
      type: 'text',
    },
    {
      name: 'image',
      relationTo: 'images',
      required: true,
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
};
