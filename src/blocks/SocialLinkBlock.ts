import { fieldsLinkExternal } from '@/field-templates/links';
import { Block } from 'payload';

export const SocialLink: Block = {
  fields: [
    ...fieldsLinkExternal,
    {
      name: 'icon',
      options: [
        {
          label: 'LinkedIn',
          value: 'linkedIn',
        },
        {
          label: 'X (Twitter)',
          value: 'twitter',
        },
        {
          label: 'Facebook',
          value: 'facebook',
        },
      ],
      type: 'select',
    },
  ],
  slug: 'socialLink',
};
