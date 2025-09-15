'use client';

import React, {
  Fragment, useActionState,
  useEffect,
  useState,
} from 'react';
import { submitForm } from '@/app/actions/submitForm';
import {
  Form as InterfaceForm, InterfaceFormBlock,
} from '@/payload-types';
import { hiddenFormDefinitionFieldName } from '@/components/blocks/Form/Form.config';

import {
  InputText, InterfaceInputTextPropTypes,
} from '@/components/base/InputText/InputText';

import { Checkbox } from '@/components/base/Checkbox/Checkbox';

import styles from '@/components/blocks/Form/Form.module.scss';

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
    errors,
    setErrors,
  ] = useState<Record<string, string[] | undefined>>({});

  useEffect(() => {
    if (!state || !state.error) {
      setErrors({});
    } else {
      setErrors(state.error.fieldErrors ?? {});
    }
  }, [state]);

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

  return (
    <form
      action={formAction}
      className={styles.form}
      noValidate
    >
      <input type='hidden' name={hiddenFormDefinitionFieldName} value={JSON.stringify(renderForm.fields)} />

      {renderForm.fields?.map((field, i) => {
        if (field.blockType === 'textBlockForm' || field.blockType === 'emailBlock' || field.blockType === 'textareaBlock') {
          let fieldType: InterfaceInputTextPropTypes['type'];

          if (field.blockType === 'textBlockForm' || field.blockType === 'emailBlock') {
            fieldType = 'text';
          } else {
            fieldType = 'textarea';
          }

          return (
            <InputText
              className={`${styles.field} ${styles[`field-width-${field.fieldWidth}`]}`}
              key={i}
              label={field.label}
              placeholder={field.placeholder}
              errorText={errors[field.name]?.join(', ') || ''}
              name={field.name}
              required={field.required || false}
              defaultValue={String(state?.values?.[field.name] ?? '')}
              type={fieldType}
              colorTheme='light'
            />
          );
        }

        if (field.blockType === 'checkboxBlock') {
          return (
            <Checkbox
              key={i}
              className={`${styles.field} ${styles[`field-width-${field.fieldWidth}`]}`}
              value='on'
              name={field.name}
              label={field.label.content}
              checked={false}
              errorText={errors[field.name]?.join(', ') || ''}
              colorTheme='light'
            />
          );
        }

        return <Fragment key={i}></Fragment>;
      })}

      <button disabled={pending}>Sign up</button>
    </form>

  );
};
