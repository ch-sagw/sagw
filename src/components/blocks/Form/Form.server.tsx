import 'server-only';
import {
  type Config,
  I18NGlobal, Form as InterfaceForm, InterfaceFormBlock,
} from '@/payload-types';
import { FormClient } from '@/components/blocks/Form/Form.client';
import { Fragment } from 'react';
import { getLocale } from 'next-intl/server';
import { rte3ToHtml } from '@/utilities/rteToHtml.server';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getPageUrl } from '@/utilities/getPageUrl';
import { rteToHtml } from '@/utilities/rteToHtml';
import { buildFormFields } from '@/components/blocks/Form/buildFormFields';

type InterfaceFormServerPropTypes = {
  globalI18n: I18NGlobal;
} & InterfaceFormBlock;

// re-exported for backwards compatibility
export { newsletterFieldNames } from '@/components/blocks/Form/Form.config';

export const FormServer = async ({
  form,
  globalI18n,
}: InterfaceFormServerPropTypes): Promise<React.JSX.Element> => {
  const payload = await getPayloadCached();

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

  // --- expand the form's field list (inject newsletter inputs, privacy
  // checkbox). The same helper is used by `submitForm` so render and
  // validation stay in sync. We do not mutate the source form; we
  // produce a new form object with the expanded fields.
  const expandedFields = await buildFormFields({
    form: renderForm,
    globalI18n,
  });
  const expandedForm: InterfaceForm = {
    ...renderForm,
    fields: expandedFields,
  };

  // --- prerender RTE content for client component
  const preRenderedLabels: Record<string, string> = {};
  const preRenderedRadioLabels: Record<string, Record<string, string>> = {};
  let submitSuccessLinkHref: string | undefined;
  let submitSuccessLinkText: string | undefined;
  let submitErrorLinkHref: string | undefined;
  let submitErrorLinkText: string | undefined;

  if (expandedForm.fields) {
    await Promise.all(expandedForm.fields.map(async (field) => {
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

  if (expandedForm.submitSuccess.optionalLink?.includeLink && expandedForm.submitSuccess.optionalLink.link?.internalLink.documentId) {
    submitSuccessLinkHref = await getPageUrl({
      locale,
      pageId: expandedForm.submitSuccess.optionalLink.link.internalLink.documentId,
      payload,
    });

    if (expandedForm.submitSuccess.optionalLink.link.linkText) {
      submitSuccessLinkText = rteToHtml(expandedForm.submitSuccess.optionalLink.link.linkText);
    }
  }

  if (expandedForm.submitError.optionalLink?.includeLink && expandedForm.submitError.optionalLink.link?.internalLink.documentId) {
    submitErrorLinkHref = await getPageUrl({
      locale,
      pageId: expandedForm.submitError.optionalLink.link.internalLink.documentId,
      payload,
    });

    if (expandedForm.submitError.optionalLink.link.linkText) {
      submitErrorLinkText = rteToHtml(expandedForm.submitError.optionalLink.link.linkText);
    }
  }

  return (
    <FormClient
      form={expandedForm}
      preRenderedLabels={preRenderedLabels}
      preRenderedRadioLabels={preRenderedRadioLabels}
      submitSuccessLinkHref={submitSuccessLinkHref}
      submitSuccessLinkText={submitSuccessLinkText}
      submitErrorLinkHref={submitErrorLinkHref}
      submitErrorLinkText={submitErrorLinkText}
    />
  );
};
