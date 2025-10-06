import {
  CollectionConfig, Field,
} from 'payload';

import {
  fieldAdminTitleDefaultValue, fieldAdminTitleFieldName,
} from '@/field-templates/adminTitle';

import {
  rte1, rte3,
} from '@/field-templates/rte';
import { versions } from '@/field-templates/versions';

const overlaySection: Field[] = [
  rte1({
    name: 'title',
    required: true,
  }),
  rte3({
    name: 'text',
    required: true,
  }),
];

const overlaySectionWithoutToggle: Field[] = [
  ...overlaySection,
  rte1({
    name: 'toggleLabel',
    required: true,
  }),
];

const overlaySectionWithToggle: Field[] = [
  ...overlaySection,
  rte1({
    name: 'toggleLabelOff',
    required: true,
  }),
  rte1({
    name: 'toggleLabelOn',
    required: true,
  }),
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
            rte1({
              name: 'title',
              required: true,
            }),
            rte3({
              name: 'text',
              required: true,
            }),
            rte1({
              name: 'buttonAcceptAll',
              required: true,
            }),
            rte1({
              name: 'buttonCustomizeSelection',
              required: true,
            }),
            rte1({
              name: 'buttonDeclineAll',
              required: true,
            }),
          ],
          label: 'Consent Banner',
          name: 'banner',
        },

        // Consent Overlay
        {
          fields: [
            rte1({
              name: 'title',
              required: true,
            }),
            rte3({
              name: 'text',
              required: true,
            }),
            rte1({
              name: 'buttonAcceptAll',
              required: true,
            }),
            rte1({
              name: 'buttonAcceptSelection',
              required: true,
            }),
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
  versions,
};
