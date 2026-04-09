import { CollectionConfig } from 'payload';
import { rte1 } from '@/field-templates/rte';
import { globalContentAccessGeneric } from '@/access/globalContent';

export const PublicationTopics: CollectionConfig = {
  access: globalContentAccessGeneric,
  admin: {
    defaultColumns: ['publicationTopic'],
    group: 'Global Content',
    hideAPIURL: process.env.ENV === 'prod',
    useAsTitle: 'publicationTopic',
  },
  fields: [
    {
      tabs: [
        {
          fields: [
            rte1({
              name: 'publicationTopic',
            }),
          ],
          label: 'Publication Topic',
        },
        {
          fields: [
            {
              admin: {
                allowCreate: false,
              },
              collection: 'publicationDetailPage',
              name: 'relatedPublicationPages',
              on: 'categorization.topic',
              type: 'join',
            },
          ],
          label: 'Related Content',
        },
      ],
      type: 'tabs',
    },
  ],
  slug: 'publicationTopics',
};
