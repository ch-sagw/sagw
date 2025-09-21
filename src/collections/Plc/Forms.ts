import type { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';
import { FormBlocks } from '@/blocks/Form/index';
import { emailBlock } from '@/blocks/Form/Email';
import { textBlock } from '@/blocks/Form/Text';
import { fieldsColorModeWhiteDark } from '@/field-templates/colorMode';

export const Forms: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    group: 'Global Content',
    useAsTitle: 'title',
  },
  fields: [

    // newsletter or custom form
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

    // color mode
    fieldsColorModeWhiteDark,

    // title & subtitle
    {
      fields: [
        {
          localized: true,
          name: 'title',
          required: true,
          type: 'text',
        },
        {
          defaultValue: '2',
          localized: true,
          name: 'titleLevel',
          options: [
            {
              label: '2',
              value: '2',
            },
            {
              label: '3',
              value: '3',
            },
            {
              label: '4',
              value: '4',
            },
            {
              label: '5',
              value: '5',
            },
          ],
          required: true,
          type: 'radio',
        },
      ],
      type: 'row',
    },
    {
      localized: true,
      name: 'subtitle',
      required: false,
      type: 'text',
    },

    // submit button
    {
      localized: true,
      name: 'submitButtonLabel',
      required: true,
      type: 'text',
    },

    // recipient
    {
      admin: {
        condition: (_, siblingData) => siblingData.isNewsletterForm === 'custom',
      },
      name: 'recipientMail',
      required: true,
      type: 'email',
    },

    // privacy checkbox
    {
      admin: {
        description: 'If enabled, the data-privacy checkebox will be added to the form. Note: you must define the "Data Privacy Checkbox Text" in "i18n Forms".',
      },
      defaultValue: true,
      name: 'showPrivacyCheckbox',
      type: 'checkbox',
    },

    // custom form fields
    {
      admin: {
        condition: (_, siblingData) => siblingData.isNewsletterForm === 'custom',
      },
      blockReferences: FormBlocks,
      blocks: [],
      name: 'fields',
      required: true,
      type: 'blocks',
    },

    // newsletter form fields
    {
      admin: {
        condition: (_, siblingData) => siblingData.isNewsletterForm === 'newsletter',
      },
      fields: [
        {
          fields: emailBlock(true).fields,
          name: 'email',
          type: 'group',
        },
        {
          fields: textBlock(true).fields,
          name: 'name',
          type: 'group',
        },
        {
          admin: {
            description: 'The action text to show at the bottom of the notification. e.g.: "Resend verifiaction E-Mail again."',
          },
          localized: true,
          name: 'actionText',
          required: true,
          type: 'text',
        },
      ],
      name: 'newsletterFields',
      type: 'group',
    },
  ],
  slug: 'forms',
  versions,
};
