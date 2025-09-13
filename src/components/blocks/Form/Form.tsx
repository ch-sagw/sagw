'use client';

import React, {
  useActionState, useEffect,
  useState,
} from 'react';
import { submitForm } from '@/app/actions/submitForm';

import { InputText } from '@/components/base/InputText/InputText';

// import styles from '@/components/blocks/Form/Form.module.scss';

export const Form = (): React.JSX.Element => {
  const [
    state,
    formAction,
    pending,
  ] = useActionState(submitForm, null);

  const [
    mailError,
    setMailError,
  ] = useState('');

  useEffect(() => {
    if (!state || !state.error) {
      setMailError('');
    } else {
      if (state.error.fieldErrors.email) {
        setMailError(state.error.fieldErrors.email.join(', '));
      }
    }

  }, [state]);

  return (
    <form action={formAction}>
      <InputText
        id='email'
        label='email'
        placeholder='some placeholder'
        errorText={mailError}
        name='email'
        required={true}
        defaultValue={state?.values.email || ''}
      />

      <button disabled={pending}>Sign up</button>
    </form>

  );
};
