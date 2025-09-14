'use client';

import React, {
  useActionState, useEffect,
  useState,
} from 'react';
import { submitForm } from '@/app/actions/submitForm';
import {
  Form as InterfaceForm, InterfaceFormBlock,
} from '@/payload-types';

import { InputText } from '@/components/base/InputText/InputText';

// import styles from '@/components/blocks/Form/Form.module.scss';

export type InterfaceFormPropTypes = {} & InterfaceFormBlock;

export const Form = ({
  form,
}: InterfaceFormPropTypes): React.JSX.Element => {
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

  if (!form) {
    return <></>;
  }

  let renderForm;

  if (typeof form === 'object') {
    renderForm = form as InterfaceForm;
  }

  if (!renderForm) {
    return <></>;
  }

  return (
    <form action={formAction}>
      {renderForm.fields?.map((field, i) => {
        if (field.blockType === 'textBlockForm' || field.blockType === 'emailBlock') {
          return (
            <InputText
              key={i}
              label={field.label}
              placeholder={field.placeholder}
              errorText={mailError}
              name={field.name}
              required={field.required || false}
              defaultValue={state?.values.email || ''}
              type={field.blockType === 'textBlockForm'
                ? 'text'
                : 'email'}
              colorTheme='light'
            />
          );
        }

        return <></>;
      })}

      <button disabled={pending}>Sign up</button>
    </form>

  );
};
