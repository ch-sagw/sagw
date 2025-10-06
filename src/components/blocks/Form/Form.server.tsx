import 'server-only';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import {
  InterfaceEmailField, Form as InterfaceForm, InterfaceFormBlock, InterfaceTextField,
} from '@/payload-types';
import { FormClient } from '@/components/blocks/Form/Form.client';
import { Fragment } from 'react';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

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
    const nameField: InterfaceTextField = {
      blockType: 'textBlockForm',
      fieldError: renderForm.newsletterFields?.name.fieldError,
      fieldWidth: 'half',
      label: renderForm.newsletterFields?.name.label || simpleRteConfig(''),
      name: 'name',
      placeholder: renderForm.newsletterFields?.name.placeholder || simpleRteConfig(''),
      required: true,
    };

    const emailField: InterfaceEmailField = {
      blockType: 'emailBlock',
      fieldError: renderForm.newsletterFields?.email.fieldError,
      fieldWidth: 'half',
      label: renderForm.newsletterFields?.email.label || simpleRteConfig(''),
      name: 'email',
      placeholder: renderForm.newsletterFields?.name.placeholder || simpleRteConfig(''),
      required: true,
    };

    renderForm.fields?.push(emailField);
    renderForm.fields?.push(nameField);
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
