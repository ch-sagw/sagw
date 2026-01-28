import { fieldsLinkInternalWithToggle } from '@/field-templates/links';
import { rte1 } from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Activities

export const EventsTeasersBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte1({
      name: 'title',
    }),
    fieldsLinkInternalWithToggle(),
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Note: If this block is placed on a page, the latest three events will be displayed here. Exeption: If this block is placed on a project detail page, all events belonging to the project are displayed here.',
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
  imageURL: '/admin-ui-images/teasers.svg',
  interfaceName: 'InterfaceEventsTeasersBlock',
  labels: {
    plural: 'Events Teasers (automatic)',
    singular: 'Events Teasers (automatic)',
  },
  slug: 'eventsTeasersBlock',
} as const satisfies Block;
