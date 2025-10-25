import 'server-only';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import {
  InterfaceEmailField, Form as InterfaceForm, InterfaceFormBlock, InterfaceRadioField,
} from '@/payload-types';
import { FormClient } from '@/components/blocks/Form/Form.client';
import { Fragment } from 'react';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { i18nForm as internalI18nForm } from '@/i18n/content';

type InterfaceFormServerPropTypes = {
  tenantId: string;
} & InterfaceFormBlock;

export const FormServer = async ({
  tenantId,
  form,
}: InterfaceFormServerPropTypes): Promise<React.JSX.Element> => {

  // --- get i18n global form data

  const payload = await getPayload({
    config: configPromise,
  });

  const i18nData = await payload.find({
    collection: 'i18nGlobals',
    depth: 1,
    where: {
      tenant: {
        equals: tenantId,
      },
    },
  });

  if (!i18nData.docs || i18nData.docs.length < 1) {
    return <p>No i18n data</p>;
  }

  const i18nForm = i18nData.docs[0].forms;

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
    const emailField: InterfaceEmailField = {
      blockType: 'emailBlock',
      fieldError: renderForm.newsletterFields?.email.fieldError,
      fieldWidth: 'half',
      label: renderForm.newsletterFields?.email.label || simpleRteConfig(''),
      name: 'email',
      placeholder: renderForm.newsletterFields?.email.placeholder ||
        '',
      required: true,
    };

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
