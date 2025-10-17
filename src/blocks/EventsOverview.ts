import { rte1 } from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Events Overview

export const EventsOverviewBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte1({
      name: 'title',
    }),
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Placeholder: all events entries will be displayed as overview here.',
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
  interfaceName: 'InterfaceEventsOverviewBlock',
  labels: {
    plural: 'Events Overview (automatic)',
    singular: 'Events Overview (automatic)',
  },
  slug: 'eventsOverviewBlock',
} as const satisfies Block;
