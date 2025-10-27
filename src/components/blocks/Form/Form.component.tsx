'use client';

import React, { Fragment } from 'react';
import { cva } from 'cva';
import { Form as InterfaceForm } from '@/payload-types';
import {
  hiddenFormDefinitionFieldName, hiddenPageUrl,
} from '@/components/blocks/Form/Form.config';
import { FormNotification } from '@/components/base/FormNotification/FormNotification';
import { Section } from '@/components/base/Section/Section';

import {
  InputText, InterfaceInputTextPropTypes,
} from '@/components/base/InputText/InputText';
import { Button } from '@/components/base/Button/Button';

import { Checkbox } from '@/components/base/Checkbox/Checkbox';
import { Radios } from '@/components/base/Radios/Radios';

import styles from '@/components/blocks/Form/Form.module.scss';
import { ZodError } from 'zod';
import {
  rte3ToHtml, rteToHtml,
} from '@/utilities/rteToHtml';
import { usePathname } from 'next/navigation';

const sectionClasses = cva([styles.formBlock], {
  variants: {
    colorMode: {
      dark: [styles.dark],
      light: [styles.light],
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
}: InterfaceFormClientPropTypes): React.JSX.Element => {
  const pathname = usePathname();

  return (
    <Section
      className={sectionClasses({
        colorMode: form.colorMode,
      })}
      showTopLine={true}
      title={rteToHtml(form.title)}
      subtitle={rteToHtml(form.subtitle)}
      colorMode={form.colorMode}
    >
      <div>
        {submitError &&
          <FormNotification
            actionText={form.isNewsletterForm === 'newsletter'
              ? form.newsletterFields?.actionText || ''
              : ''
            }
            autofocus={true}
            colorMode={form.colorMode}
            onAction={() => {

              // TODO
              console.log('todo');
            }}
            text={rteToHtml(form.submitError.text)}
            title={rteToHtml(form.submitError.title)}
            type='error'
            className={styles.errorNotification}
          />
        }

        {submitSuccess &&
          <FormNotification
            actionText={form.isNewsletterForm === 'newsletter'
              ? form.newsletterFields?.actionText || ''
              : ''
            }
            autofocus={true}
            colorMode={form.colorMode}

            // TODO
            onAction={() => {
              console.log('todo');
            }}
            text={rteToHtml(form.submitSuccess.text)}
            title={rteToHtml(form.submitSuccess.title)}
            type='success'
          />
        }

        {!submitSuccess &&
          <form
            action={action}
            className={styles.form}
            noValidate
          >
            <input type='hidden' name={hiddenFormDefinitionFieldName} value={JSON.stringify(form)} />
            <input type='hidden' name={hiddenPageUrl} value={pathname
              ? pathname.toString()
              : ''
            } />

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
                    label={rteToHtml(field.label)}
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
                } else if (field.defaultChecked) {
                  checked = field.defaultChecked;
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
                    label={rte3ToHtml(field.label)}
                    checked={checked}
                    errorText={errors[field.name]?.join(', ') || ''}
                    colorMode={form.colorMode}
                  />
                );
              }

              if (field.blockType === 'radioBlock') {
                return (
                  <Radios
                    key={i}
                    className={fieldClasses({
                      fieldWidth: field.fieldWidth,
                    })}
                    colorTheme={form.colorMode}
                    name={field.name}
                    items={field.items.map((item) => ({
                      checked: item.defaultChecked ?? undefined,
                      label: rte3ToHtml(item.label),
                      value: item.value,
                    }))}
                    errorText={errors[field.name]?.join(', ') || ''}
                    descriptionLabel={rte3ToHtml(field.label)}
                  />
                );
              }

              return <Fragment key={i}></Fragment>;
            })}

            <Button
              element='button'
              disabled={pending}
              buttonType='submit'
              colorMode={form.colorMode}
              style='filled'
              text={form.submitButtonLabel}
            />
          </form>
        }
      </div>
    </Section >
  );
};
