import {
  CollectionConfig, Field,
} from 'payload';
import { fieldsLinkExternal } from '@/field-templates/links';

import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';
import { rte1 } from '@/field-templates/rte';
import { globalContentAccessNoTranslatorNoEditor } from '@/access/globalContent';
import { hookInvalidateCacheOnPageChange } from '@/hooks-payload/invalidateCacheOnPageChange';

const fieldsSocialLink: Field[] = [
  {
    admin: {
      width: '50%',
    },
    fields: [
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
            label: 'Instagram',
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
    ],
    type: 'row',
  },
];

export const Footer: CollectionConfig = {
  access: globalContentAccessNoTranslatorNoEditor,
  admin: {
    group: 'Global Content',
    hideAPIURL: process.env.ENV === 'prod',
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
              name: 'cookieSettings',
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
            {
              admin: {
                width: '50%',
              },
              fields: [
                rte1({
                  disableLocalization: false,
                  name: 'poBox',
                  notRequired: true,
                }),
                rte1({
                  disableLocalization: true,
                  name: 'countryCode',
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
                  disableLocalization: true,
                  name: 'zipCode',
                }),
                rte1({
                  name: 'city',
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
              type: 'row',
            },
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
  hooks: {
    afterChange: [hookInvalidateCacheOnPageChange],
  },
  labels: {
    plural: 'Footer',
    singular: 'Footer',
  },
  slug: 'footer',
};
