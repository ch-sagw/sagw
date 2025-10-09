import { Block } from 'payload';

// Example: About SAGW -> Team

export const ProjectOverviewBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Placeholder: all project detail pages will be displayed as overview here.',
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
  interfaceName: 'InterfaceProjectOverviewBlock',
  labels: {
    plural: 'Projects Overview (automatic)',
    singular: 'Projects Overview (automatic)',
  },
  slug: 'projectsOverviewBlock',
} as const satisfies Block;
