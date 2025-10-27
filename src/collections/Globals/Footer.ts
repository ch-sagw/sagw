import {
  CollectionConfig, Field,
} from 'payload';
import { fieldsLinkExternal } from '@/field-templates/links';

import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { rte1 } from '@/field-templates/rte';

const fieldsSocialLink: Field[] = [
  ...fieldsLinkExternal({
    hideLinkText: true,
  }),
  {
    name: 'icon',
    options: [
      {
        label: 'LinkedIn',
        value: 'linkedIn',
      },
      {
        label: 'Intagram',
        value: 'instagram',
      },
      {
        label: 'Facebook',
        value: 'facebook',
      },
      {
        label: 'X (Twitter)',
        value: 'twitter',
      },
    ],
    required: true,
    type: 'select',
  },
];

export const Footer: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Global Content',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldAdminTitleDefaultValue('Footer'),
    {
      tabs: [
        {
          fields: [
            rte1({
              name: 'dataPrivacy',
            }),
            rte1({
              name: 'impressum',
            }),
            rte1({
              disableLocalization: true,
              name: 'copyright',
            }),
          ],
          interfaceName: 'InterfaceFooterLegal',
          name: 'legal',
        },
        {
          fields: [
            rte1({
              name: 'title',
            }),
            rte1({
              disableLocalization: true,
              name: 'address1',
            }),
            rte1({
              disableLocalization: true,
              name: 'address2',
              notRequired: true,
            }),
            rte1({
              disableLocalization: false,
              name: 'poBox',
              notRequired: true,
            }),
            rte1({
              disableLocalization: true,
              name: 'countryCode',
            }),
            rte1({
              disableLocalization: true,
              name: 'zipCode',
            }),
            rte1({
              name: 'city',
            }),
            rte1({
              disableLocalization: true,
              name: 'phone',
              notRequired: true,
            }),
            rte1({
              disableLocalization: true,
              name: 'mail',
              notRequired: true,
            }),
          ],
          interfaceName: 'InterfaceFooterContact',
          name: 'contact',
        },
        {
          fields: [
            {
              fields: fieldsSocialLink,
              name: 'items',
              required: false,
              type: 'array',
            },
          ],
          interfaceName: 'InterfaceFooterSocialLinks',
          name: 'socialLinks',
        },
      ],
      type: 'tabs',
    },
  ],
  labels: {
    plural: 'Footer',
    singular: 'Footer',
  },
  slug: 'footer',
};
