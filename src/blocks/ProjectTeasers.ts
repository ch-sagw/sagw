import { rte1 } from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Activities

export const ProjectTeasersBlock: Block = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte1({
      name: 'linkText',
      required: true,
    }),
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'Note: the latest projects from porject detail pages will be displayed here.',
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
  interfaceName: 'InterfaceProjectTeasersBlock',
  labels: {
    plural: 'Projects Teasers (automatic)',
    singular: 'Projects Teasers (automatic)',
  },
  slug: 'projectsTeasersBlock',
};
