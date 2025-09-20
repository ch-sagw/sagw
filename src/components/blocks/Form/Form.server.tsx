import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import {
  Form as InterfaceForm, InterfaceFormBlock, InterfaceI18NForms,
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

  // --- Privacy Checkbox

  if (renderForm.showPrivacyCheckbox) {
    renderForm.fields?.push({
      blockType: 'checkboxBlock',
      fieldError: i18nForm.dataPrivacyCheckbox.errorMessage,
      fieldWidth: 'full',
      label: {
        content: i18nForm.dataPrivacyCheckbox.dataPrivacyCheckboxText.content,
      },
      name: 'privacyCheckbox',
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
