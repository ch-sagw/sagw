import type { CollectionConfig } from 'payload';
import { rte1 } from '@/field-templates/rte';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { globalContentAccessGeneric } from '@/access/globalContent';

export const People: CollectionConfig = {
  access: globalContentAccessGeneric,
  admin: {
    group: 'Global Content',
    hideAPIURL: process.env.ENV === 'prod',
    useAsTitle: 'fullName',
  },
  fields: [
    {
      admin: {
        width: '33.33%',
      },
      fields: [
        rte1({
          disableLocalization: true,
          name: 'firstname',
        }),
        rte1({
          disableLocalization: true,
          name: 'middleName',
          notRequired: true,
        }),
        rte1({
          disableLocalization: true,
          name: 'lastname',
        }),
      ],
      type: 'row',
    },
    {
      admin: {
        width: '50%',
      },
      fields: [
        rte1({
          name: 'prefix',
          notRequired: true,
        }),
        rte1({
          name: 'function',
          notRequired: true,
        }),
      ],
      type: 'row',
    },
    {
      admin: {
        width: '33.33%',
      },
      fields: [

        {
          localized: false,
          name: 'mail',
          required: true,
          type: 'text',
        },
        {
          localized: false,
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
      ],
      type: 'row',
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
              return `${rte1ToPlaintext(data.firstname)} ${rte1ToPlaintext(data.lastname)}`;
            }

            return '';
          },
        ],
      },
      name: 'fullName',
      type: 'text',
    },
    {
      admin: {
        allowCreate: false,
      },
      collection: 'teams',
      name: 'relatedTeams',
      on: 'people',
      type: 'join',
    },
  ],
  labels: {
    plural: 'People',
    singular: 'People',
  },
  slug: 'people',
};
