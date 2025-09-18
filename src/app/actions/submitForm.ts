'use server';

import { z } from 'zod';
import { hiddenFormDefinitionFieldName } from '@/components/blocks/Form/Form.config';

type SubmitFormResult =
  | null
  | {
      error: z.ZodFlattenedError<Record<string, unknown>>;
      values: Record<string, unknown>;
    };

export const submitForm = async (prevState: any, formData: FormData): Promise<SubmitFormResult> => {

  // TEMP: until we do async work (send mail), we silence the warning
  // with some kind of await
  await new Promise((resolve) => setTimeout(resolve, 0));

  const fields = JSON.parse(formData.get(hiddenFormDefinitionFieldName) as string);

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

  if (!validated.success) {
    return {
      error: z.flattenError(validated.error),
      values: data,
    };
  }

  // TODO: do something, like sending an email

  return null;
};
