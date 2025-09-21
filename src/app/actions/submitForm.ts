'use server';

import { z } from 'zod';
import { hiddenFormDefinitionFieldName } from '@/components/blocks/Form/Form.config';
import { sendMail } from '@/mail/sendMail';
import { subscribe } from '@/mail/subscribe';

type SubmitFormResult =
  | {
    success: true;
  }
  | {
      success: false;
      error?: z.ZodFlattenedError<Record<string, unknown>>;
      values?: Record<string, unknown>;
    };

export const submitForm = async (prevState: any, formData: FormData): Promise<SubmitFormResult> => {
  const hiddenFormData = JSON.parse(formData.get(hiddenFormDefinitionFieldName) as string);
  const {
    fields,
  } = hiddenFormData;

  const shape: Record<string, any> = {};

  for (const field of fields) {
    if (field.blockType === 'emailBlock') {
      if (field.required) {
        shape[field.name] = z
          .email(field.fieldError);
      } else {
        shape[field.name] = z
          .email(field.fieldError)
          .optional()
          .or(z.literal(''));
      }
    } else if (field.blockType === 'textBlockForm' || field.blockType === 'textareaBlock') {
      if (field.required) {
        shape[field.name] = z
          .string()
          .min(1, field.fieldError);
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
            message: field.fieldError,
          });
      } else {
        shape[field.name] = z.string()
          .optional();
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
      content: 'helo from sagw',
      from: process.env.MAIL_SENDER_ADDRESS,
      subject: 'subject',

      // testing mail send
      to: 'delivered@resend.dev',

      // real mail send
      // to: hiddenFormData.recipientMail,
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
