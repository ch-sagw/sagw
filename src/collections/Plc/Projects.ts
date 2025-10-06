import { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';

export const Projects: CollectionConfig = {
  admin: {
    defaultColumns: ['name'],
    description: 'You can assign NewsDetail Pages, Event Detail Pages and Documents to a project. Then you could add a Downloads block to a page an tell it to list all downloads related to a project.',
    group: 'Global Content',
    useAsTitle: 'name',
  },
  fields: [
    {
      localized: true,
      name: 'name',
      required: true,
      type: 'text',
    },

    // Joins
    {
      admin: {
        allowCreate: false,
      },
      collection: 'newsDetailPage',
      name: 'relatedNewsPages',
      on: 'project',
      type: 'join',
    },
    {
      admin: {
        allowCreate: false,
      },
      collection: 'eventDetailPage',
      name: 'relatedEventPages',
      on: 'eventDetails.project',
      type: 'join',
    },
    {
      admin: {
        allowCreate: false,
      },
      collection: 'publicationDetailPage',
      name: 'relatedPublicationPages',
      on: 'categorization.project',
      type: 'join',
    },
    {
      admin: {
        allowCreate: false,
      },
      collection: 'projectDetailPage',
      name: 'relatedProjectPages',
      on: 'project',
      type: 'join',
    },
    {
      admin: {
        allowCreate: false,
      },
      collection: 'documents',
      name: 'relatedDocuments',
      on: 'project',
      type: 'join',
    },
    {
      admin: {
        allowCreate: false,
      },
      collection: 'zenodoDocuments',
      name: 'relatedZenodoDocuments',
      on: 'project',
      type: 'join',
    },
  ],
  slug: 'projects',
  versions,
};
