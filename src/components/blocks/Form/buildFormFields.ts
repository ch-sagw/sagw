import 'server-only';
import { getTranslations } from 'next-intl/server';
import {
  I18NGlobal,
  InterfaceCheckboxField,
  InterfaceEmailField,
  Form as InterfaceForm,
  InterfaceRadioField,
  InterfaceTextField,
} from '@/payload-types';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { newsletterFieldNames } from '@/components/blocks/Form/Form.config';

type FormField =
  | InterfaceCheckboxField
  | InterfaceRadioField
  | InterfaceEmailField
  | InterfaceTextField
  | NonNullable<InterfaceForm['fields']>[number];

// newsletter forms have no `fields[]` in payload — their user-facing
// inputs (firstname, lastname, email, optional language selector) are
// derived at runtime from `newsletterFields`. Custom forms use their
// stored `fields[]` as-is. All forms may append a privacy checkbox.
//
// used by both `Form.server.tsx` (rendering) and `submitForm.ts`
// (validation + mail body) so the two paths stay in sync.
export const buildFormFields = async ({
  form,
  globalI18n,
}: {
  form: InterfaceForm;
  globalI18n: I18NGlobal;
}): Promise<FormField[]> => {
  const fields: FormField[] = [...(form.fields ?? [])];

  if (form.isNewsletterForm === 'newsletter') {
    const internalI18nForm = await getTranslations('form');

    const firstnameField: InterfaceTextField = {
      blockType: 'textBlockForm',
      fieldError: form.newsletterFields?.firstName.fieldError,
      fieldWidth: 'half',
      label: form.newsletterFields?.firstName.label || simpleRteConfig(''),
      name: newsletterFieldNames.firstname,
      placeholder: form.newsletterFields?.firstName.placeholder || '',
      required: true,
    };

    const lastnameField: InterfaceTextField = {
      blockType: 'textBlockForm',
      fieldError: form.newsletterFields?.lastName.fieldError,
      fieldWidth: 'half',
      label: form.newsletterFields?.lastName.label || simpleRteConfig(''),
      name: newsletterFieldNames.lastname,
      placeholder: form.newsletterFields?.lastName.placeholder || '',
      required: true,
    };

    const emailField: InterfaceEmailField = {
      blockType: 'emailBlock',
      fieldError: form.newsletterFields?.email.fieldError,
      fieldWidth: 'full',
      label: form.newsletterFields?.email.label || simpleRteConfig(''),
      name: newsletterFieldNames.email,
      placeholder: form.newsletterFields?.email.placeholder || '',
      required: true,
    };

    fields.push(firstnameField, lastnameField, emailField);

    if (form.newsletterFields?.includeLanguageSelection === 'yes') {
      const radioBlock: InterfaceRadioField = {
        blockType: 'radioBlock',
        fieldError: simpleRteConfig(internalI18nForm('newsletter.error')),
        fieldWidth: 'full',
        items: [
          {
            label: simpleRteConfig(internalI18nForm('newsletter.languages.german')),
            value: 'de',
          },
          {
            label: simpleRteConfig(internalI18nForm('newsletter.languages.french')),
            value: 'fr',
          },
        ],
        label: simpleRteConfig(internalI18nForm('newsletter.label')),
        name: newsletterFieldNames.language,
        required: true,
      };

      fields.push(radioBlock);
    }
  }

  if (form.showPrivacyCheckbox) {
    const privacyCheckbox: InterfaceCheckboxField = {
      blockType: 'checkboxBlock',
      fieldError: globalI18n.forms.dataPrivacyCheckbox.errorMessage,
      fieldWidth: 'full',
      label: globalI18n.forms.dataPrivacyCheckbox.dataPrivacyCheckboxText,
      name: `checkbox-${form.id}`,
      required: true,
    };

    fields.push(privacyCheckbox);
  }

  return fields;
};
