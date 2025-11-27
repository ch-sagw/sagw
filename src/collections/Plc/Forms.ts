import type { CollectionConfig } from 'payload';
import { FormBlocks } from '@/blocks/Form/index';
import { emailBlock } from '@/blocks/Form/Email';
import { fieldsColorMode } from '@/field-templates/colorMode';
import { formEnsureUniqueName } from '@/hooks-payload/formEnsureUniqueName';
import { fieldsLinkInternalWithToggle } from '@/field-templates/links';
import {
  rte1, rte2,
} from '@/field-templates/rte';
import { textBlock } from '@/blocks/Form/Text';
import { globalContentAccessGeneric } from '@/access/globalContent';
import { fieldAccessAdminsOnly } from '@/access/fields/localizedFields';
import { isSuperOrTenantAdmin } from '@/collections/Plc/Users/roles';

export const Forms: CollectionConfig = {
  access: globalContentAccessGeneric,
  admin: {
    group: 'Global Content',
    hidden: (req) => !isSuperOrTenantAdmin(req.user),
    hideAPIURL: process.env.ENV === 'prod',
    useAsTitle: 'title',
  },
  fields: [

    // newsletter or custom form
    {
      access: fieldAccessAdminsOnly,
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
    fieldsColorMode({
      adminOnly: true,
      dark: true,
      light: true,
      white: true,
    }),

    // title & subtitle
    rte1({
      access: fieldAccessAdminsOnly,
      name: 'title',
      notRequired: true,
    }),
    rte2({
      access: fieldAccessAdminsOnly,
      name: 'subtitle',
      notRequired: true,
    }),

    // submit button
    {
      access: fieldAccessAdminsOnly,
      localized: true,
      name: 'submitButtonLabel',
      required: true,
      type: 'text',
    },

    // recipient
    {
      access: fieldAccessAdminsOnly,
      admin: {
        condition: (_, siblingData) => siblingData.isNewsletterForm === 'custom',
      },
      name: 'recipientMail',
      required: true,
      type: 'email',
    },

    // Mail subject
    {
      access: fieldAccessAdminsOnly,
      admin: {
        condition: (_, siblingData) => siblingData.isNewsletterForm === 'custom',
      },
      name: 'mailSubject',
      required: true,
      type: 'text',
    },

    // privacy checkbox
    {
      access: fieldAccessAdminsOnly,
      admin: {
        description: 'If enabled, the data-privacy checkebox will be added to the form. Note: you must define the "Data Privacy Checkbox Text" in "i18n Forms".',
      },
      defaultValue: true,
      name: 'showPrivacyCheckbox',
      type: 'checkbox',
    },

    // error/success for custom form
    {
      fields: [
        {
          access: fieldAccessAdminsOnly,
          fields: [
            rte1({
              name: 'title',
            }),
            rte1({
              name: 'text',
            }),
            fieldsLinkInternalWithToggle({}),
          ],
          label: 'Submit Success',
          name: 'submitSuccess',
          type: 'group',
        },

        {
          access: fieldAccessAdminsOnly,
          fields: [
            rte1({
              name: 'title',
            }),
            rte1({
              name: 'text',
            }),
            fieldsLinkInternalWithToggle({}),
          ],
          label: 'Submit Error',
          name: 'submitError',
          type: 'group',
        },
      ],
      type: 'group',
    },

    // custom form fields
    {
      access: fieldAccessAdminsOnly,
      admin: {
        condition: (_, siblingData) => siblingData.isNewsletterForm === 'custom',
      },
      blocks: FormBlocks,
      hooks: {
        beforeChange: [formEnsureUniqueName],
      },
      name: 'fields',
      required: true,
      type: 'blocks',
    },

    // newsletter form fields
    {
      access: fieldAccessAdminsOnly,
      admin: {
        condition: (_, siblingData) => siblingData.isNewsletterForm === 'newsletter',
      },
      fields: [
        {
          admin: {
            description: 'This value must match with the name of the Newsletter List from MailXpert',
          },
          localized: false,
          name: 'newsletterList',
          required: true,
          type: 'text',
        },
        {
          fields: emailBlock(true).fields,
          name: 'email',
          type: 'group',
        },
        {
          fields: textBlock(true).fields,
          name: 'firstName',
          type: 'group',
        },
        {
          fields: textBlock(true).fields,
          name: 'lastName',
          type: 'group',
        },
        {
          admin: {
            description: 'The action text to show at the bottom of the notification. e.g.: "Send verifiaction E-Mail again."',
          },
          localized: true,
          name: 'actionText',
          required: true,
          type: 'text',
        },
        {
          admin: {
            description: 'If enabled, we show a language selection for Germand and French.',
          },
          defaultValue: 'no',
          name: 'includeLanguageSelection',
          options: [
            {
              label: 'No',
              value: 'no',
            },
            {
              label: 'Yes',
              value: 'yes',
            },
          ],
          type: 'radio',
        },
      ],
      name: 'newsletterFields',
      type: 'group',
    },
  ],
  slug: 'forms',
};
