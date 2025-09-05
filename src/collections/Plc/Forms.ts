import type { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';
import { FormBlocks } from '@/blocks/Form/index';
import { emailBlock } from '@/blocks/Form/Email';
import { textBlock } from '@/blocks/Form/Text';

export const Forms: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    group: 'Global Content',
    useAsTitle: 'title',
  },
  fields: [
    {
      admin: {
        description: 'A newsletter form has a fixed set of fields. Custom form can be build with any combination of fields as you like.',
      },
      defaultValue: 'custom',
      name: 'isNewsletterForm',
      options: [
        {
          label: 'Custom Form',
          value: 'custom',
        },
        {
          label: 'Newsletter Form',
          value: 'newsletter',
        },
      ],
      type: 'radio',
    },
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'subtitle',
      required: false,
      type: 'text',
    },
    {
      localized: true,
      name: 'submitButtonLabel',
      required: true,
      type: 'text',
    },
    {
      admin: {
        condition: (_, siblingData) => siblingData.isNewsletterForm === 'custom',
      },
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
      admin: {
        condition: (_, siblingData) => siblingData.isNewsletterForm === 'custom',
      },
      blocks: FormBlocks,
      name: 'fields',
      required: true,
      type: 'blocks',
    },
    {
      admin: {
        condition: (_, siblingData) => siblingData.isNewsletterForm === 'newsletter',
      },
      fields: [
        {
          fields: emailBlock(true).fields,
          name: 'emailField',
          type: 'group',
        },
        {
          fields: textBlock(true).fields,
          name: 'textField',
          type: 'group',
        },
      ],
      name: 'newsletterForm',
      type: 'group',
    },
  ],
  slug: 'forms',
  versions,
};
