'use server';

import 'server-only';
import { z } from 'zod';
import {
  hiddenFormIdFieldName, hiddenPageUrl,
} from '@/components/blocks/Form/Form.config';
import { sendMail } from '@/mail/sendMail';
import { subscribe } from '@/mail/subscribe';
import { Form as InterfaceForm } from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { newsletterFieldNames } from '@/components/blocks/Form/Form.server';
import { getPayloadCached } from '@/utilities/getPayloadCached';

type SubmitFormResult =
  | {
    success: true;
  }
  | {
      success: false;
      error?: z.ZodFlattenedError<Record<string, unknown>>;
      values?: Record<string, unknown>;
    };

type SubmissionField = {
  blockType: 'checkboxBlock' | 'emailBlock' | 'radioBlock' | 'textBlockForm' | 'textareaBlock';
  fieldError?: unknown;
  name: string;
  required?: boolean;
};

const getPageUrl = (value: FormDataEntryValue | null): string => {
  if (typeof value !== 'string' || !value.startsWith('/')) {
    return '/';
  }

  return value;
};

const getFieldErrorMessage = (field: SubmissionField, fallback: string): string => {
  if (field.fieldError) {
    return rteToHtml(field.fieldError as any) || fallback;
  }

  return fallback;
};

const getSubmissionFields = (form: InterfaceForm): SubmissionField[] => {
  const fields: SubmissionField[] = (form.fields || []).map((field) => ({
    blockType: field.blockType as SubmissionField['blockType'],
    fieldError: 'fieldError' in field
      ? field.fieldError
      : undefined,
    name: field.name,
    required: field.required ?? undefined,
  }));

  if (form.isNewsletterForm === 'newsletter') {
    fields.push(
      {
        blockType: 'textBlockForm',
        fieldError: form.newsletterFields?.firstName.fieldError,
        name: newsletterFieldNames.firstname,
        required: true,
      },
      {
        blockType: 'textBlockForm',
        fieldError: form.newsletterFields?.lastName.fieldError,
        name: newsletterFieldNames.lastname,
        required: true,
      },
      {
        blockType: 'emailBlock',
        fieldError: form.newsletterFields?.email.fieldError,
        name: newsletterFieldNames.email,
        required: true,
      },
    );

    if (form.newsletterFields?.includeLanguageSelection === 'yes') {
      fields.push({
        blockType: 'radioBlock',
        name: newsletterFieldNames.language,
        required: true,
      });
    }
  }

  if (form.showPrivacyCheckbox && form.id) {
    fields.push({
      blockType: 'checkboxBlock',
      name: `checkbox-${form.id}`,
      required: true,
    });
  }

  return fields;
};

const generateMailContent = (formData: FormData, hiddenFormData: InterfaceForm, hiddenUrl: string): string => {
  let mailContent = '';

  // add url
  mailContent += `URL: ${hiddenUrl}<br><br><br>`;

  // add title and subtitle
  mailContent += `${rte1ToPlaintext(hiddenFormData.title)}<br>`;
  mailContent += `${rte1ToPlaintext(hiddenFormData.subtitle)}<br><br><br>`;

  // add field data
  hiddenFormData.fields?.forEach((field) => {
    const {
      name,
    } = field;
    const value = formData.get(name);

    mailContent += `${name}:<br>${value}<br><br><br>`;
  });

  return mailContent;
};

export const submitForm = async (prevState: any, formData: FormData): Promise<SubmitFormResult> => {
  const formId = formData.get(hiddenFormIdFieldName);
  const hiddenUrl = getPageUrl(formData.get(hiddenPageUrl));

  if (typeof formId !== 'string' || !formId) {
    return {
      success: false,
    };
  }

  const payload = await getPayloadCached();

  let authoritativeForm: InterfaceForm;

  try {
    authoritativeForm = await payload.findByID({
      collection: 'forms',
      depth: 0,
      id: formId,
    }) as InterfaceForm;
  } catch {
    return {
      success: false,
    };
  }

  const {
    fields,
  } = {
    fields: getSubmissionFields(authoritativeForm),
  };

  const shape: Record<string, any> = {};

  if (!fields) {
    return {
      success: true,
    };
  }

  for (const field of fields) {
    if (field.blockType === 'emailBlock') {
      if (field.required) {
        shape[field.name] = z
          .email(getFieldErrorMessage(field, 'Please provide a valid email address.'));
      } else {
        shape[field.name] = z
          .email(getFieldErrorMessage(field, 'Please provide a valid email address.'))
          .optional()
          .or(z.literal(''));
      }
    } else if (field.blockType === 'textBlockForm' || field.blockType === 'textareaBlock') {
      if (field.required) {
        shape[field.name] = z
          .string()
          .min(1, getFieldErrorMessage(field, 'This field is required.'));
      } else {
        shape[field.name] = z.string()
          .optional()
          .or(z.literal(''));
      }
    } else if (field.blockType === 'checkboxBlock') {
      if (field.required) {
        shape[field.name] = z
          .string()
          .refine((val) => val === 'on', {
            message: getFieldErrorMessage(field, 'Please confirm this field.'),
          });
      } else {
        shape[field.name] = z.string()
          .optional();
      }
    } else if (field.blockType === 'radioBlock') {
      if (field.required) {
        shape[field.name] = z
          .string()
          .min(1, getFieldErrorMessage(field, 'This field is required.'));
      } else {
        shape[field.name] = z.string()
          .optional()
          .or(z.literal(''));
      }
    }
  }

  const schema = z.object(shape);

  const data: Record<string, unknown> = {};

  fields.forEach((f: any) => {
    const val = formData.get(f.name);

    if (f.blockType === 'checkboxBlock') {
      // Normalize unchecked checkboxes to empty string
      data[f.name] = val === null
        ? ''
        : val;
    } else if (f.blockType === 'radioBlock') {
      // Radio buttons return the selected value or null if none selected
      data[f.name] = val || '';
    } else {
      data[f.name] = val;
    }
  });

  const validated = schema.safeParse(data);

  // validation result
  if (!validated.success) {
    return {
      error: z.flattenError(validated.error),
      success: false,
      values: data,
    };
  }

  if (!process.env.MAIL_SENDER_ADDRESS) {
    return {
      success: false,
      values: data,
    };
  }

  // send mail or subscribe
  if (authoritativeForm.isNewsletterForm === 'custom') {
    const mailResult = await sendMail({
      content: generateMailContent(formData, authoritativeForm, hiddenUrl),
      from: process.env.MAIL_SENDER_ADDRESS,
      subject: authoritativeForm.mailSubject || '',
      to: authoritativeForm.recipientMail || '',
    });

    if (mailResult) {
      return {
        success: true,
      };
    }
  } else {
    if (!authoritativeForm.newsletterFields?.newsletterListId || !authoritativeForm.newsletterFields?.newsletterTemporaryListId) {
      return {
        success: false,
        values: data,
      };
    }

    const subscribeResult = await subscribe({
      email: formData.get(newsletterFieldNames.email),
      firstname: formData.get(newsletterFieldNames.firstname),
      language: formData.get(newsletterFieldNames.language),
      lastname: formData.get(newsletterFieldNames.lastname),
      listId: authoritativeForm.newsletterFields?.newsletterListId,
      listIdTemp: authoritativeForm.newsletterFields?.newsletterTemporaryListId,
    });

    if (subscribeResult === 'pendingVerification') {
      return {
        success: true,
      };
    }

    return {
      success: false,
    };
  }

  return {
    success: false,
    values: data,
  };
};
