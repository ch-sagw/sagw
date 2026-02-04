'use client';

import React, {
  startTransition, useActionState, useRef, useState,
} from 'react';
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

  // Store the last submitted FormData for resubmission
  const lastSubmittedFormDataRef = useRef<FormData | null>(null);
  // Track if resend button has been clicked (for success notification)
  const [
    resendClicked,
    setResendClicked,
  ] = useState(false);
  // Track if resend button has been clicked (for error notification)
  const [
    errorResendClicked,
    setErrorResendClicked,
  ] = useState(false);

  // Wrapper function that captures FormData before submission
  const wrappedFormAction = (formData: FormData): ReturnType<typeof formAction> => {
    // Store the FormData for potential resubmission
    lastSubmittedFormDataRef.current = formData;
    // Reset resend clicked states on new submission
    setResendClicked(false);
    setErrorResendClicked(false);

    // Call the original form action
    return formAction(formData);
  };

  // Function to resubmit with the last FormData (for success notification)
  const handleResubmit = (): void => {
    const formData = lastSubmittedFormDataRef.current;

    if (formData) {
      setResendClicked(true);
      startTransition(() => {
        formAction(formData);
      });
    }
  };

  // Function to resubmit with the last FormData (for error notification)
  const handleErrorResubmit = (): void => {
    const formData = lastSubmittedFormDataRef.current;

    if (formData) {
      setErrorResendClicked(true);
      startTransition(() => {
        formAction(formData);
      });
    }
  };

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
      action={wrappedFormAction}
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
      onResubmitAction={handleResubmit}
      onErrorResubmitAction={handleErrorResubmit}
      resendClicked={resendClicked}
      errorResendClicked={errorResendClicked}
    />
  );
};
