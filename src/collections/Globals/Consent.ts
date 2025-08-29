import {
  CollectionConfig, Field,
} from 'payload';

import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';

import { rte2 } from '@/field-templates/rte';

const overlaySection: Field[] = [
  {
    localized: true,
    name: 'title',
    required: true,
    type: 'text',
  },
  {
    editor: rte2,
    localized: true,
    name: 'text',
    required: true,
    type: 'richText',
  },
];

const overlaySectionWithoutToggle: Field[] = [
  ...overlaySection,
  {
    localized: true,
    name: 'toggleLabel',
    required: true,
    type: 'text',
  },
];

const overlaySectionWithToggle: Field[] = [
  ...overlaySection,
  {
    localized: true,
    name: 'toggleLabelOff',
    required: true,
    type: 'text',
  },
  {
    localized: true,
    name: 'toggleLabelOn',
    required: true,
    type: 'text',
  },
  {
    defaultValue: 'on',
    name: 'toggleDefault',
    options: [
      {
        label: 'on',
        value: 'on',
      },
      {
        label: 'off',
        value: 'off',
      },
    ],
    type: 'select',
  },
];

export const Consent: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Global Content',
    useAsTitle: fieldAdminTitleFieldName,
  },
  fields: [
    fieldAdminTitleDefaultValue('Consent'),
    {
      tabs: [

        // Consent Banner
        {
          fields: [
            {
              localized: true,
              name: 'title',
              required: true,
              type: 'text',
            },
            {
              editor: rte2,
              localized: true,
              name: 'text',
              required: true,
              type: 'richText',
            },
            {
              localized: true,
              name: 'buttonAcceptAll',
              required: true,
              type: 'text',
            },
            {
              localized: true,
              name: 'buttonCustomizeSelection',
              required: true,
              type: 'text',
            },
            {
              localized: true,
              name: 'buttonDeclineAll',
              required: true,
              type: 'text',
            },
          ],
          label: 'Consent Banner',
          name: 'banner',
        },

        // Consent Overlay
        {
          fields: [
            {
              localized: true,
              name: 'title',
              required: true,
              type: 'text',
            },
            {
              editor: rte2,
              localized: true,
              name: 'text',
              required: true,
              type: 'richText',
            },
            {
              localized: true,
              name: 'buttonAcceptAll',
              required: true,
              type: 'text',
            },
            {
              localized: true,
              name: 'buttonAcceptSelection',
              required: true,
              type: 'text',
            },

            {
              fields: overlaySectionWithoutToggle,
              label: 'Necessary Cookies',
              name: 'necessaryCookies',
              type: 'group',
            },

            {
              fields: overlaySectionWithToggle,
              label: 'Analytics and Performance Cookies',
              name: 'analyticsPerformance',
              type: 'group',
            },

            {
              fields: overlaySectionWithToggle,
              label: 'External Content',
              name: 'externalContent',
              type: 'group',
            },

          ],
          label: 'Consent Overlay',
          name: 'overlay',
        },
      ],
      type: 'tabs',
    },
  ],
  labels: {
    plural: 'Consent',
    singular: 'Consent',
  },
  slug: 'consent',
};
