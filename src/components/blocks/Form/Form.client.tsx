'use client';

import React, { useActionState } from 'react';
import { submitForm } from '@/app/actions/submitForm';
import { Form as InterfaceForm } from '@/payload-types';
import { FormComponent } from '@/components/blocks/Form/Form.component';

type InterfaceFormClientPropTypes = {
  form: InterfaceForm;
  preRenderedLabels: Record<string, string>;
  preRenderedRadioLabels: Record<string, Record<string, string>>;
};

export const FormClient = ({
  form,
  preRenderedLabels,
  preRenderedRadioLabels,
}: InterfaceFormClientPropTypes): React.JSX.Element => {

  // --- State

  const [
    state,
    formAction,
    pending,
  ] = useActionState(submitForm, null);

  // derive values from action state
  const errors: Record<string, string[] | undefined> =
    !state || state.success
      ? {}
      : (state.error?.fieldErrors ?? {});
  const submitSuccess = state?.success ?? false;
  const submitError = Boolean(state && !state.success && !state.error);
  const firstErrorFieldName = Object.keys(errors)[0] ?? '';

  // --- Render

  return (
    <FormComponent
      form={form}
      action={formAction}
      firstErrorFieldName={firstErrorFieldName}
      pending={pending}
      state={
        !state || state.success
          ? null
          : {
            error: state.error,
            values: state.values,
          }
      }
      errors={errors}
      submitSuccess={submitSuccess}
      submitError={submitError}
      preRenderedLabels={preRenderedLabels}
      preRenderedRadioLabels={preRenderedRadioLabels}
    />
  );
};
