'use client';

import React, { Fragment } from 'react';
import { cva } from 'cva';
import { Form as InterfaceForm } from '@/payload-types';
import {
  hiddenFormIdFieldName,
  hiddenFormLocaleFieldName,
  hiddenPageUrl,
} from '@/components/blocks/Form/Form.config';
import { Notification } from '@/components/base/Notification/Notification';
import { Section } from '@/components/base/Section/Section';

import {
  InputText, InterfaceInputTextPropTypes,
} from '@/components/base/InputText/InputText';
import { Button } from '@/components/base/Button/Button';

import { Checkbox } from '@/components/base/Checkbox/Checkbox';
import { Radios } from '@/components/base/Radios/Radios';

import styles from '@/components/blocks/Form/Form.module.scss';
import { ZodError } from 'zod';
import { rteToHtml } from '@/utilities/rteToHtml';
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
  locale: string;
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
  preRenderedLabels: Record<string, string>;
  preRenderedRadioLabels: Record<string, Record<string, string>>;
  submitSuccessLinkHref?: string;
  submitSuccessLinkText?: string;
  submitErrorLinkHref?: string;
  submitErrorLinkText?: string;
  onResubmitAction?: () => void;
  onErrorResubmitAction?: () => void;
  resendClicked?: boolean;
  errorResendClicked?: boolean;
};

export const FormComponent = ({
  form,
  locale,
  action,
  firstErrorFieldName,
  pending,
  state,
  errors,
  submitError,
  submitSuccess,
  preRenderedLabels,
  preRenderedRadioLabels,
  submitSuccessLinkHref,
  submitSuccessLinkText,
  submitErrorLinkHref,
  submitErrorLinkText,
  onResubmitAction,
  onErrorResubmitAction,
  resendClicked,
  errorResendClicked,
}: InterfaceFormClientPropTypes): React.JSX.Element => {
  const pathname = usePathname();
  const submitErrorLink = submitErrorLinkHref && submitErrorLinkText
    ? {
      linkHref: submitErrorLinkHref,
      linkText: submitErrorLinkText,
    }
    : undefined;
  const submitSuccessLink = submitSuccessLinkHref && submitSuccessLinkText
    ? {
      linkHref: submitSuccessLinkHref,
      linkText: submitSuccessLinkText,
    }
    : undefined;
  const renderFormNotification = ({
    actionText,
    className,
    link,
    onAction,
    text,
    title,
    type,
  }: {
    actionText: string;
    className?: string;
    link?: {
      linkHref: string;
      linkText: string;
    };
    onAction: () => void;
    text: string;
    title?: string;
    type: 'error' | 'success';
  }): React.JSX.Element => {
    const sharedProps = {
      actionText,
      autofocus: true,
      className,
      colorMode: form.colorMode,
      onAction,
      text,
      title,
      type,
    };

    if (link) {
      return (
        <Notification
          {...sharedProps}
          linkHref={link.linkHref}
          linkText={link.linkText}
        />
      );
    }

    return (
      <Notification
        {...sharedProps}
      />
    );
  };

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
          renderFormNotification({
            actionText: !errorResendClicked && form.isNewsletterForm === 'newsletter'
              ? form.newsletterFields?.actionText || ''
              : '',
            className: styles.errorNotification,
            link: submitErrorLink,
            onAction: () => {
              if (onErrorResubmitAction) {
                onErrorResubmitAction();
              }
            },
            text: rteToHtml(form.submitError.text),
            title: rteToHtml(form.submitError.title),
            type: 'error',
          })
        }

        {submitSuccess &&
          renderFormNotification({
            actionText: !resendClicked && form.isNewsletterForm === 'newsletter'
              ? form.newsletterFields?.actionText || ''
              : '',
            link: submitSuccessLink,
            onAction: () => {
              if (onResubmitAction) {
                onResubmitAction();
              }
            },
            text: rteToHtml(form.submitSuccess.text),
            title: rteToHtml(form.submitSuccess.title),
            type: 'success',
          })
        }

        {!submitSuccess &&
          <form
            action={action}
            className={styles.form}
            noValidate
          >
            <input type='hidden' name={hiddenFormIdFieldName} value={String(form.id)} />
            <input type='hidden' name={hiddenFormLocaleFieldName} value={locale} />
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
                    key={`${field.name}-${String(state?.values?.[field.name] ?? '')}`}
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
                    key={`${field.name}-${serverState ?? ''}`}
                    className={fieldClasses({
                      fieldWidth: field.fieldWidth,
                    })}
                    value='on'
                    name={field.name}
                    label={preRenderedLabels[field.name] || rteToHtml(field.label)}
                    checked={checked}
                    errorText={errors[field.name]?.join(', ') || ''}
                    colorMode={form.colorMode}
                  />
                );
              }

              if (field.blockType === 'radioBlock') {
                const selectedRadioValue = String(state?.values?.[field.name] ?? '');

                return (
                  <Radios
                    key={`${field.name}-${selectedRadioValue}`}
                    className={fieldClasses({
                      fieldWidth: field.fieldWidth,
                    })}
                    colorTheme={form.colorMode}
                    name={field.name}
                    items={field.items.map((item) => {
                      const isSelectedFromServer = selectedRadioValue
                        ? item.value === selectedRadioValue
                        : false;

                      return ({
                        checked: isSelectedFromServer
                          ? true
                          : (item.defaultChecked ?? undefined),
                        label: preRenderedRadioLabels[field.name]?.[item.value] || rteToHtml(item.label),
                        value: item.value,
                      });
                    })}
                    errorText={errors[field.name]?.join(', ') || ''}
                    descriptionLabel={preRenderedLabels[field.name] || rteToHtml(field.label)}
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
