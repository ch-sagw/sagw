import 'server-only';
import {
  I18NGlobal,
  InterfaceEmailField, Form as InterfaceForm, InterfaceFormBlock, InterfaceRadioField,
  InterfaceTextField,
} from '@/payload-types';
import { FormClient } from '@/components/blocks/Form/Form.client';
import { Fragment } from 'react';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { i18nForm as internalI18nForm } from '@/i18n/content';

type InterfaceFormServerPropTypes = {
  globalI18n: I18NGlobal;
} & InterfaceFormBlock;

export const FormServer = ({
  form,
  globalI18n,
}: InterfaceFormServerPropTypes): React.JSX.Element => {

  const i18nForm = globalI18n.forms;

  // --- Make sure form exists

  if (!form) {
    return <Fragment></Fragment>;
  }

  let renderForm;

  if (typeof form === 'object') {
    renderForm = form as InterfaceForm;
  }

  if (!renderForm) {
    return <Fragment></Fragment>;
  }

  // --- Reformat Newsletter form fields

  /*
    in payload: custom form is build with form-block elements.
    newsletter form is build with default payload fields, hence they have
    a different data structure.

    We manually add fields to the fields array here, so that we don't have
    to adapt the form render logic.
  */
  if (renderForm.isNewsletterForm === 'newsletter') {
    const firstnameField: InterfaceTextField = {
      blockType: 'textBlockForm',
      fieldError: renderForm.newsletterFields?.firstName.fieldError,
      fieldWidth: 'half',
      label: renderForm.newsletterFields?.firstName.label || simpleRteConfig(''),
      name: 'firstname',
      placeholder: renderForm.newsletterFields?.firstName.placeholder || '',
      required: true,
    };

    const lastnameField: InterfaceTextField = {
      blockType: 'textBlockForm',
      fieldError: renderForm.newsletterFields?.lastName.fieldError,
      fieldWidth: 'half',
      label: renderForm.newsletterFields?.lastName.label || simpleRteConfig(''),
      name: 'lastname',
      placeholder: renderForm.newsletterFields?.lastName.placeholder || '',
      required: true,
    };

    const emailField: InterfaceEmailField = {
      blockType: 'emailBlock',
      fieldError: renderForm.newsletterFields?.email.fieldError,
      fieldWidth: 'full',
      label: renderForm.newsletterFields?.email.label || simpleRteConfig(''),
      name: 'email',
      placeholder: renderForm.newsletterFields?.email.placeholder ||
        '',
      required: true,
    };

    renderForm.fields?.push(firstnameField);
    renderForm.fields?.push(lastnameField);
    renderForm.fields?.push(emailField);

    // add language selection

    // TODO: get language from root

    if (renderForm.newsletterFields?.includeLanguageSelection === 'yes') {
      const radioBlock: InterfaceRadioField = {
        blockType: 'radioBlock',
        fieldError: simpleRteConfig(internalI18nForm.newsletter.error.de),
        fieldWidth: 'full',
        items: [
          {
            label: simpleRteConfig(internalI18nForm.newsletter.languages.german.de),
            value: 'german',
          },
          {
            label: simpleRteConfig(internalI18nForm.newsletter.languages.french.de),
            value: 'french',
          },
        ],
        label: simpleRteConfig(internalI18nForm.newsletter.label.de),
        name: 'language',
        required: true,
      };

      renderForm.fields?.push(radioBlock);
    }
  }

  // --- Privacy Checkbox

  if (renderForm.showPrivacyCheckbox) {
    renderForm.fields?.push({
      blockType: 'checkboxBlock',
      fieldError: i18nForm.dataPrivacyCheckbox.errorMessage,
      fieldWidth: 'full',
      label: i18nForm.dataPrivacyCheckbox.dataPrivacyCheckboxText,
      name: `checkbox-${renderForm.id}`,
      required: true,
    });
  }

  return (
    <FormClient
      form={renderForm}
    />
  );
};
