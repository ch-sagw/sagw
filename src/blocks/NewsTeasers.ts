import { fieldsColorMode } from '@/field-templates/colorMode';
import { fieldsLinkInternalWithToggle } from '@/field-templates/links';
import { rte1 } from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Activities

export const NewsTeasersBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    fieldsColorMode({
      dark: false,
      light: true,
      white: true,
    }),
    rte1({
      name: 'title',
    }),
    fieldsLinkInternalWithToggle(),
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Note: If this block is placed on a page, the latest three news will be displayed here. Exeption: If this block is placed on a project detail page, all news belonging to the project are displayed here.',
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
