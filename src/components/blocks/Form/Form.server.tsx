import 'server-only';
import {
  type Config,
  I18NGlobal, InterfaceEmailField, Form as InterfaceForm, InterfaceFormBlock,
  InterfaceRadioField, InterfaceTextField,
} from '@/payload-types';
import { FormClient } from '@/components/blocks/Form/Form.client';
import { Fragment } from 'react';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  getLocale, getTranslations,
} from 'next-intl/server';
import { rte3ToHtml } from '@/utilities/rteToHtml.server';
import { getPayloadCached } from '@/utilities/getPayloadCached';

type InterfaceFormServerPropTypes = {
  globalI18n: I18NGlobal;
} & InterfaceFormBlock;

export const FormServer = async ({
  form,
  globalI18n,
}: InterfaceFormServerPropTypes): Promise<React.JSX.Element> => {
  const payload = await getPayloadCached();
  const i18nForm = globalI18n.forms;
  const internalI18nForm = await getTranslations('form');

  // --- Make sure form exists

  if (!form) {
    return <Fragment></Fragment>;
  }

  let renderForm: InterfaceForm | undefined;
  const locale = (await getLocale()) as Config['locale'];

  // Always fetch the form fresh to ensure we have all fields
  let formId: string | undefined;

  if (typeof form === 'string') {
    formId = form;
  } else if (typeof form === 'object' && form !== null && 'id' in form) {
    formId = typeof form.id === 'string'
      ? form.id
      : String(form.id);
  }

  if (formId) {
    const fetchedForm = await payload.findByID({
      collection: 'forms',
      depth: 0,
      id: formId,
      locale,
    });

    if (!fetchedForm) {
      return <Fragment></Fragment>;
    }

    renderForm = fetchedForm as InterfaceForm;
  } else {
    // Fallback: use the form object if we can't extract an ID
    if (typeof form === 'object' && form !== null) {
      renderForm = form as InterfaceForm;
    }
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

    if (renderForm.newsletterFields?.includeLanguageSelection === 'yes') {
      const radioBlock: InterfaceRadioField = {
        blockType: 'radioBlock',
        fieldError: simpleRteConfig(internalI18nForm('newsletter.error')),
        fieldWidth: 'full',
        items: [
          {
            label: simpleRteConfig(internalI18nForm('newsletter.languages.german')),
            value: 'german',
          },
          {
            label: simpleRteConfig(internalI18nForm('newsletter.languages.french')),
            value: 'french',
          },
        ],
        label: simpleRteConfig(internalI18nForm('newsletter.label')),
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

  // --- prerender RTE content for client component
  const preRenderedLabels: Record<string, string> = {};
  const preRenderedRadioLabels: Record<string, Record<string, string>> = {};

  if (renderForm.fields) {
    await Promise.all(renderForm.fields.map(async (field) => {
      if (field.blockType === 'checkboxBlock' && field.label) {
        const labelHtml = await rte3ToHtml({
          content: field.label,
          locale,
          payload,
        });

        preRenderedLabels[field.name] = labelHtml;
      }

      if (field.blockType === 'radioBlock') {
        if (field.label) {
          const labelHtml = await rte3ToHtml({
            content: field.label,
            locale,
            payload,
          });

          preRenderedLabels[field.name] = labelHtml;
        }

        if (field.items) {
          preRenderedRadioLabels[field.name] = {};
          await Promise.all(field.items.map(async (item) => {
            if (item.label) {
              const itemLabelHtml = await rte3ToHtml({
                content: item.label,
                locale,
                payload,
              });

              preRenderedRadioLabels[field.name][item.value] = itemLabelHtml;
            }
          }));
        }
      }
    }));
  }

  return (
    <FormClient
      form={renderForm}
      preRenderedLabels={preRenderedLabels}
      preRenderedRadioLabels={preRenderedRadioLabels}
    />
  );
};
