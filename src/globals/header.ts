import { LinkExternal } from '@/blocks/LinkExternal';
import { GlobalConfig } from 'payload';

export const headerConfig: GlobalConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Global Content',
  },
  fields: [
    {
      name: 'logo',
      relationTo: 'images',
      required: true,
      type: 'relationship',
    },

    {
      fields: LinkExternal.fields,
      maxRows: 3,
      name: 'metaLinks',
      required: true,
      type: 'array',
    },

    {
      fields: [
        {
          localized: true,
          name: 'home',
          required: true,
          type: 'text',
        },
        {
          fields: [
            {
              localized: true,
              name: 'description',
              required: true,
              type: 'text',
            },
            {
              label: 'Übersicht',
              localized: true,
              name: 'overview',
              required: true,
              type: 'text',
            },
            {
              label: 'Institute',
              localized: true,
              name: 'institutes',
              required: true,
              type: 'text',
            },
            {
              label: 'Editionen',
              localized: true,
              name: 'editions',
              required: true,
              type: 'text',
            },
            {
              label: 'Reisebeiträge',
              localized: true,
              name: 'travelReports',
              required: true,
              type: 'text',
            },
            {
              label: 'Early Career Award',
              localized: true,
              name: 'earlyCareerAward',
              required: true,
              type: 'text',
            },
          ],
          label: 'Förderung',
          name: 'promotion',
          type: 'group',
        },

        {
          fields: [
            {
              localized: true,
              name: 'description',
              required: true,
              type: 'text',
            },
            {
              label: 'Netzwerk',
              localized: true,
              name: 'network',
              required: true,
              type: 'text',
            },
          ],
          label: 'Netzwerk',
          name: 'network',
          type: 'group',
        },

        {
          fields: [
            {
              localized: true,
              name: 'description',
              required: true,
              type: 'text',
            },
            {
              label: 'Übersicht',
              localized: true,
              name: 'overview',
              required: true,
              type: 'text',
            },
            {
              label: 'Magazin',
              localized: true,
              name: 'magazine',
              required: true,
              type: 'text',
            },
            {
              label: 'Publikationen',
              localized: true,
              name: 'publications',
              required: true,
              type: 'text',
            },
            {
              label: 'Veranstaltungen',
              localized: true,
              name: 'events',
              required: true,
              type: 'text',
            },

          ],
          label: 'Aktivitäten',
          name: 'activities',
          type: 'group',
        },

        {
          fields: [
            {
              localized: true,
              name: 'description',
              required: true,
              type: 'text',
            },
            {
              label: 'Die SAGW',
              localized: true,
              name: 'sagw',
              required: true,
              type: 'text',
            },
            {
              label: 'Team',
              localized: true,
              name: 'team',
              required: true,
              type: 'text',
            },
            {
              label: 'Kontakt',
              localized: true,
              name: 'contact',
              required: true,
              type: 'text',
            },
            {
              label: 'Offene Stellen',
              localized: true,
              name: 'openJobs',
              required: true,
              type: 'text',
            },

          ],
          label: 'Über uns',
          name: 'about',
          type: 'group',
        },
      ],
      label: 'Navigation',
      name: 'navigation',
      type: 'group',
    },
  ],
  slug: 'header',
};
