import { alignementHorizontalVertical } from '@/field-templates/alignement';
import { fieldsLinkInternal } from '@/field-templates/links';
import { rte1 } from '@/field-templates/rte';
import { Block } from 'payload';

// Example: Activities

export const ProjectTeasersBlock = {
  admin: {
    disableBlockName: true,
  },
  fields: [
    rte1({
      name: 'title',
    }),
    rte1({
      name: 'lead',
      notRequired: true,
    }),
    alignementHorizontalVertical,
    ...fieldsLinkInternal({
      optional: true,
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
} as const satisfies Block;
