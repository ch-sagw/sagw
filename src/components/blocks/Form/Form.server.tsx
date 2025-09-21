import 'server-only';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import {
  InterfaceEmailField, Form as InterfaceForm, InterfaceFormBlock, InterfaceI18NForms, InterfaceTextField,
} from '@/payload-types';
import { FormClient } from '@/components/blocks/Form/Form.client';
import { Fragment } from 'react';

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
    collection: 'i18nForms',
    depth: 1,
    where: {
      department: {
        equals: tenantId,
      },
    },
  });

  if (!i18nData.docs || i18nData.docs.length < 1) {
    return <p>No i18n data</p>;
  }

  const i18nForm = i18nData.docs[0].i18nForms as InterfaceI18NForms;

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
      label: renderForm.newsletterFields?.name.label || '',
      name: 'name',
      placeholder: renderForm.newsletterFields?.name.placeholder || '',
      required: true,
    };

    const emailField: InterfaceEmailField = {
      blockType: 'emailBlock',
      fieldError: renderForm.newsletterFields?.email.fieldError,
      fieldWidth: 'half',
      label: renderForm.newsletterFields?.email.label || '',
      name: 'email',
      placeholder: renderForm.newsletterFields?.name.placeholder || '',
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
      label: {
        content: i18nForm.dataPrivacyCheckbox.dataPrivacyCheckboxText.content,
      },
      name: `checkbox-${renderForm.id}`,
      required: true,
    });
  }

  return (
    <FormClient
      form={renderForm}
      i18n={i18nForm}
    />
  );
};
