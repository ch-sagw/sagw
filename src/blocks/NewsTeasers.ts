import { fieldsLinkInternalWithToggle } from '@/field-templates/links';
import { rte1 } from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Activities

export const NewsTeasersBlock = {
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
      defaultValue: 'Note: the newest news teasers will be displayed here.',
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
  interfaceName: 'InterfaceNewsTeasersBlock',
  labels: {
    plural: 'News Teasers (automatic)',
    singular: 'News Teasers (automatic)',
  },
  slug: 'newsTeasersBlock',
} as const satisfies Block;
