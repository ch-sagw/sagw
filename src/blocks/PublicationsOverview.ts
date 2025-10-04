import { Block } from 'payload';

// Example: Publications Overview

export const PublicationsOverviewBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'filterTitleAllTopics',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'filterTitleAllPublications',
      required: true,
      type: 'text',
    },
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Placeholder: all publications entries will be displayed as overview here.',
      name: 'message',
      type: 'text',
    },
    {
      admin: {
        components: {
          Field: '@/components/admin/BlockInfo',
        },
      },
      name: 'explanation',
      type: 'ui',
    },
  ],
  imageURL: '/admin-ui-images/overview.svg',
  interfaceName: 'InterfacePublicationsOverviewBlock',
  labels: {
    plural: 'Publications Overview (automatic)',
    singular: 'Publications Overview (automatic)',
  },
  slug: 'publicationsOverviewBlock',
};
