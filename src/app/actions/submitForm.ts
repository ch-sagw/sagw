'use server';

import { z } from 'zod';
import {
  hiddenFormDefinitionFieldName, hiddenPageUrl,
} from '@/components/blocks/Form/Form.config';
import { sendMail } from '@/mail/sendMail';
import { subscribe } from '@/mail/subscribe';
import { Form as InterfaceForm } from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';

type SubmitFormResult =
  | {
    success: true;
  }
  | {
      success: false;
      error?: z.ZodFlattenedError<Record<string, unknown>>;
      values?: Record<string, unknown>;
    };

const generateMailContent = (formData: FormData, hiddenFormData: InterfaceForm, hiddenUrl: string): string => {
  let mailContent = '';

  // add url
  mailContent += `URL: ${hiddenUrl}\n\n\n`;

  // add title and subtitle
  mailContent += `${rte1ToPlaintext(hiddenFormData.title)}\n`;
  mailContent += `${rte1ToPlaintext(hiddenFormData.subtitle)}\n\n\n`;

  // add field data
  hiddenFormData.fields?.forEach((field) => {
    const {
      name,
    } = field;
    const value = formData.get(name);

    mailContent += `${name}:\n${value}\n\n\n`;
  });

  return mailContent;
};

export const submitForm = async (prevState: any, formData: FormData): Promise<SubmitFormResult> => {

  const hiddenFormData: InterfaceForm = JSON.parse(formData.get(hiddenFormDefinitionFieldName) as string);
  const hiddenUrl: string = formData.get(hiddenPageUrl) as string;
  const {
    fields,
  } = hiddenFormData;

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
          .email(rteToHtml(field.fieldError) || '');
      } else {
        shape[field.name] = z
          .email(rteToHtml(field.fieldError) || '')
          .optional()
          .or(z.literal(''));
      }
    } else if (field.blockType === 'textBlockForm' || field.blockType === 'textareaBlock') {
      if (field.required) {
        shape[field.name] = z
          .string()
          .min(1, rteToHtml(field.fieldError) || '');
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
            message: rteToHtml(field.fieldError) || '',
          });
      } else {
        shape[field.name] = z.string()
          .optional();
      }
    } else if (field.blockType === 'radioBlock') {
      if (field.required) {
        shape[field.name] = z
          .string()
          .min(1, rteToHtml(field.fieldError) || '');
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
  if (hiddenFormData.isNewsletterForm === 'custom') {
    const mailResult = await sendMail({
      content: generateMailContent(formData, hiddenFormData, hiddenUrl),
      from: process.env.MAIL_SENDER_ADDRESS,
      subject: hiddenFormData.mailSubject || '',
      to: hiddenFormData.recipientMail || '',
    });

    if (mailResult) {
      return {
        success: true,
      };
    }
  } else {
    const subscribeResult = await subscribe();

    if (subscribeResult) {
      return {
        success: true,
      };
    }
  }

  return {
    success: false,
    values: data,
  };
};
