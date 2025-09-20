'use client';

/*
1. render newsletter form
2. get global 18n form data for success and error
3. make notification component

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

  // --- Effects

  useEffect(() => {
    if (!state || !state.error) {
      setErrors({});
    } else {
      setErrors(state.error.fieldErrors ?? {});
    }
  }, [state]);

  useEffect(() => {

    const [firstErrorKey] = Object.keys(errors);

    if (firstErrorKey) {
      setFirstErrorFieldName(firstErrorKey);
    }
  }, [errors]);

  // --- Render

  return (
    <FormComponent
      form={form}
      action={formAction}
      firstErrorFieldName={firstErrorFieldName}
      pending={pending}
      state={state}
      errors={errors}
    />
  );
};
