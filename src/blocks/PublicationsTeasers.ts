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
      defaultValue: 'Note: If this block is placed on a page, the latest four publications will be displayed here. Exeptions: If this block is placed on a project detail page, all publications belonging to the project are displayed here. If this block is placed on a publication detail page, the last four publications with the same topic are displayed here.',
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
