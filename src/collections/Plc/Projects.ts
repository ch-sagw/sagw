import { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';

export const Projects: CollectionConfig = {
  admin: {
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
  ],
  slug: 'projects',
  versions,
};
