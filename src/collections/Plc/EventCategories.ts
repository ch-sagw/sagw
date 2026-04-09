import { CollectionConfig } from 'payload';
import { rte1 } from '@/field-templates/rte';
import { globalContentAccessGeneric } from '@/access/globalContent';

export const EventCategories: CollectionConfig = {
  access: globalContentAccessGeneric,
  admin: {
    defaultColumns: ['eventCategory'],
    group: 'Global Content',
    hideAPIURL: process.env.ENV === 'prod',
    useAsTitle: 'eventCategory',
  },
  fields: [
    {
      tabs: [
        {
          fields: [
            rte1({
              name: 'eventCategory',
            }),
          ],
          label: 'Event Category',
        },
        {
          fields: [
            {
              admin: {
                allowCreate: false,
              },
              collection: 'eventDetailPage',
              name: 'relatedEventPages',
              on: 'eventDetails.category',
              type: 'join',
            },
          ],
          label: 'Related Content',
        },
      ],
      type: 'tabs',
    },

  ],
  slug: 'eventCategory',
};
