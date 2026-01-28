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
import {
  hookInvalidateCacheOnReferencedCollectionChange,
  hookInvalidateCacheOnReferencedCollectionDelete,
} from '@/hooks-payload/invalidateCacheOnReferencedCollectionChange';

export const Forms: CollectionConfig = {
  access: globalContentAccessGeneric,
  admin: {
    group: 'Global Content',
    hidden: (req) => !isSuperOrTenantAdmin(req.user),
    hideAPIURL: process.env.ENV === 'prod',
    useAsTitle: 'title',
  },
  fields: [
    {
      tabs: [
        {
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

            // title & subtitle
            {
              admin: {
                width: '50%',
              },
              fields: [
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
              ],
              type: 'row',
            },

            {
              admin: {
                width: '33.33%',
              },
              fields: [

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
                  label: 'Recipient email address',
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
                  label: 'Message will be displyed in the subject field of the email sent to the recipient.',
                  name: 'mailSubject',
                  required: true,
                  type: 'text',
                },
              ],
              type: 'row',
            },

            // color mode
            fieldsColorMode({
              adminOnly: true,
              dark: true,
              light: true,
              white: true,
            }),

            // privacy checkbox
            {
              access: fieldAccessAdminsOnly,
              admin: {
                description: 'If enabled, the data-privacy checkebox will be added to the form. Note: you must define the "Data Privacy Checkbox Text" in "content snippets".',
              },
              defaultValue: true,
              name: 'showPrivacyCheckbox',
              type: 'checkbox',
            },
          ],
          label: 'General',
        },
        {
          fields: [
            // error/success for custom form
            {
              fields: [
                {
                  access: fieldAccessAdminsOnly,
                  fields: [
                    {
                      admin: {
                        width: '50%',
                      },
                      fields: [
                        rte1({
                          name: 'title',
                        }),
                        rte1({
                          name: 'text',
                        }),

                      ],
                      type: 'row',
                    },
                    fieldsLinkInternalWithToggle({}),
                  ],
                  label: 'Submission Success',
                  name: 'submitSuccess',
                  type: 'group',
                },

                {
                  access: fieldAccessAdminsOnly,
                  fields: [
                    {
                      admin: {
                        width: '50%',
                      },
                      fields: [
                        rte1({
                          name: 'title',
                        }),
                        rte1({
                          name: 'text',
                        }),
                      ],
                      type: 'row',
                    },
                    fieldsLinkInternalWithToggle({}),
                  ],
                  label: 'Submission Error',
                  name: 'submitError',
                  type: 'group',
                },
              ],
              type: 'group',
            },
          ],
          label: 'Notifications',
        },
        {
          fields: [
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
                    description: 'Double-Opt-In: first, users are assigned to a temporary contact list in brevo. Only after verifying the link in the e-mail, they are moved to the final contact list. This value must match the id of the temporary contact list.',
                  },
                  localized: false,
                  name: 'newsletterTemporaryListId',
                  required: true,
                  type: 'number',
                },
                {
                  admin: {
                    description: 'Double-Opt-In: first, users are assigned to a temporary contact list in brevo. Only after verifying the link in the e-mail, they are moved to the final contact list. This value must match the id of the final contact list.',
                  },
                  localized: false,
                  name: 'newsletterListId',
                  required: true,
                  type: 'number',
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
                    description: 'Text is shown in the notification that appears after the user has sumbitted the form. The link behind the text allows the user to re-send the verification email. e.g.: "Send verifiaction E-Mail again."',
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
          label: 'Fields',
        },
      ],
      type: 'tabs',
    },

  ],
  hooks: {
    afterChange: [hookInvalidateCacheOnReferencedCollectionChange],
    afterDelete: [hookInvalidateCacheOnReferencedCollectionDelete],
  },
  slug: 'forms',
};
