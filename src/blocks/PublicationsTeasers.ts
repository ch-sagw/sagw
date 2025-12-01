import { fieldsLinkInternalWithToggle } from '@/field-templates/links';
import { rte1 } from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Activities

export const PublicationsTeasersBlock = {
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
      defaultValue: 'Note: the latest publications teasers will be displayed here.',
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
  interfaceName: 'InterfacePublicationsTeasersBlock',
  labels: {
    plural: 'Publications Teasers (automatic)',
    singular: 'Publications Teasers (automatic)',
  },
  slug: 'publicationsTeasersBlock',
} as const satisfies Block;
