'use client';

/*
1. render newsletter form
2. get global 18n form data for success and error
3. make notification component
4. properly configure from/to mail addresses
5. handle submit success/error appropriately
*/

import React, {
  useActionState,
  useEffect,
  useState,
} from 'react';
import { submitForm } from '@/app/actions/submitForm';
import {
  Form as InterfaceForm, InterfaceI18NForms,
} from '@/payload-types';
import { FormComponent } from '@/components/blocks/Form/Form.component';

type InterfaceFormClientPropTypes = {
  form: InterfaceForm;
  i18n: InterfaceI18NForms;
};

export const FormClient = ({
  form,
}: InterfaceFormClientPropTypes): React.JSX.Element => {

  // --- State

  const [
    state,
    formAction,
    pending,
  ] = useActionState(submitForm, null);

  const [
    errors,
    setErrors,
  ] = useState<Record<string, string[] | undefined>>({});

  const [
    firstErrorFieldName,
    setFirstErrorFieldName,
  ] = useState('');

  const [
    submitError,
    setSubmitError,
  ] = useState(false);

  const [
    submitSuccess,
    setSubmitSuccess,
  ] = useState(false);

  // --- Effects

  useEffect(() => {

    // form submitted successfully
    if (state && state.success) {
      setSubmitError(false);
      setSubmitSuccess(true);
    }

    // might be initial state
    if (!state || state.success) {
      setErrors({});
    } else {

      // field errors
      setErrors(state.error?.fieldErrors ?? {});

      // form submission error
      if (!state.error) {
        setSubmitError(true);
        setSubmitSuccess(false);
      }
    }
  }, [state]);

  useEffect(() => {

    const [firstErrorKey] = Object.keys(errors);

    if (firstErrorKey) {
      setFirstErrorFieldName(firstErrorKey);
    }
  }, [errors]);

  // general submit success / error

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
    />
  );
};
