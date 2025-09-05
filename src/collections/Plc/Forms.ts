import type { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';
import { FormBlocks } from '@/blocks/Form/index';

export const Forms: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    group: 'Global Content',
  },
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'submitButtonLabel',
      required: true,
      type: 'text',
    },
    {
      name: 'recipientMail',
      required: true,
      type: 'email',
    },
    {
      admin: {
        description: 'If enabled, the data-privacy checkebox will be added to the form. Note: you must define the "Data Privacy Checkbox Text" in "i18n Forms".',
      },
      defaultValue: true,
      name: 'showPrivacyCheckbox',
      type: 'checkbox',
    },
    {
      blocks: FormBlocks,
      name: 'fields',
      required: true,
      type: 'blocks',
    },
  ],
  slug: 'forms',
  versions,
};
