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
  }),
  rte3({
    name: 'text',
  }),
];

const overlaySectionWithoutToggle: Field[] = [
  ...overlaySection,
  rte1({
    name: 'toggleLabel',
  }),
];

const overlaySectionWithToggle: Field[] = [
  ...overlaySection,
  rte1({
    name: 'toggleLabelOff',
  }),
  rte1({
    name: 'toggleLabelOn',
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
            }),
            rte3({
              name: 'text',
            }),
            rte1({
              name: 'buttonAcceptAll',
            }),
            rte1({
              name: 'buttonCustomizeSelection',
            }),
            rte1({
              name: 'buttonDeclineAll',
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
            }),
            rte3({
              name: 'text',
            }),
            rte1({
              name: 'buttonAcceptAll',
            }),
            rte1({
              name: 'buttonAcceptSelection',
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
