'use client';

import React, { Fragment } from 'react';
import { cva } from 'cva';
import {
  Form as InterfaceForm, InterfaceI18NForms,
} from '@/payload-types';
import { hiddenFormDefinitionFieldName } from '@/components/blocks/Form/Form.config';
import { FormNotification } from '@/components/base/FormNotification/FormNotification';

import {
  InputText, InterfaceInputTextPropTypes,
} from '@/components/base/InputText/InputText';

import { Checkbox } from '@/components/base/Checkbox/Checkbox';

import styles from '@/components/blocks/Form/Form.module.scss';
import { ZodError } from 'zod';

const sectionClasses = cva([styles.formBlock], {
  variants: {
    colorMode: {
      dark: [styles.dark],
      white: null,
    },
  },
});

const fieldClasses = cva([styles.field], {
  variants: {
    fieldWidth: {
      full: [styles.full],
      half: [styles.half],
    },
  },
});

type InterfaceFormClientPropTypes = {
  form: InterfaceForm;
  action: (payload: FormData) => void;
  firstErrorFieldName: string;
  pending: boolean;
  state: {
    error?: ReturnType<ZodError['flatten']>;
    values?: Record<string, unknown>;
  } | null;
  errors: Record<string, string[] | undefined>;
  submitError: boolean;
  submitSuccess: boolean;
  i18n: InterfaceI18NForms;
};

export const FormComponent = ({
  form,
  action,
  firstErrorFieldName,
  pending,
  state,
  errors,
  submitError,
  submitSuccess,
  i18n,
}: InterfaceFormClientPropTypes): React.JSX.Element => {

  const TitleElem: React.ElementType = `h${form.titleLevel}`;

  return (
    <section
      className={sectionClasses({
        colorMode: form.colorMode,
      })}
    >
      {submitError &&
        <FormNotification
          actionText='foo'
          colorMode={form.colorMode}
          onAction={() => {

            // TODO
            console.log('todo');
          }}
          text={i18n.submitError.text}
          title={i18n.submitError.title}
          type='error'
        />
      }
      {submitSuccess &&
        <FormNotification
          actionText='foo'
          colorMode={form.colorMode}

          // TODO
          onAction={() => {
            console.log('todo');
          }}
          text={i18n.submitSuccess.text}
          title={i18n.submitSuccess.title}
          type='success'
        />
      }

      <TitleElem className={styles.title}>{form.title}</TitleElem>
      {form.subtitle &&
        <p className={styles.subtitle}>{form.subtitle}</p>
      }

      <form
        action={action}
        className={styles.form}
        noValidate
      >
        <input type='hidden' name={hiddenFormDefinitionFieldName} value={JSON.stringify(form)} />

        {form.fields?.map((field, i) => {
          if (field.blockType === 'textBlockForm' || field.blockType === 'emailBlock' || field.blockType === 'textareaBlock') {
            let fieldType: InterfaceInputTextPropTypes['type'];

            if (field.blockType === 'textBlockForm' || field.blockType === 'emailBlock') {
              fieldType = 'text';
            } else {
              fieldType = 'textarea';
            }

            return (
              <InputText
                autofocus={field.name === firstErrorFieldName}
                className={fieldClasses({
                  fieldWidth: field.fieldWidth,
                })}
                key={i}
                label={field.label}
                placeholder={field.placeholder}
                errorText={errors[field.name]?.join(', ') || ''}
                name={field.name}
                required={field.required || false}
                defaultValue={String(state?.values?.[field.name] ?? '')}
                type={fieldType}
                colorMode={form.colorMode}
              />
            );
          }

          if (field.blockType === 'checkboxBlock') {
            let checked = false;
            const serverState = state?.values?.[field.name];

            if (serverState) {
              checked = serverState === 'on';
            }

            return (
              <Checkbox
                autofocus={field.name === firstErrorFieldName}
                key={i}
                className={fieldClasses({
                  fieldWidth: field.fieldWidth,
                })}
                value='on'
                name={field.name}
                label={field.label.content}
                checked={checked}
                errorText={errors[field.name]?.join(', ') || ''}
                colorMode={form.colorMode}
              />
            );
          }

          return <Fragment key={i}></Fragment>;
        })}

        <button disabled={pending}>{form.submitButtonLabel}</button>
      </form>
    </section>
  );
};
