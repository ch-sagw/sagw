'use server';

import 'server-only';
import { z } from 'zod';
import { getLocale } from 'next-intl/server';
import {
  hiddenFormIdFieldName, hiddenPageUrl, newsletterFieldNames,
} from '@/components/blocks/Form/Form.config';
import { sendMail } from '@/mail/sendMail';
import { subscribe } from '@/mail/subscribe';
import {
  type Config, I18NGlobal, Form as InterfaceForm,
} from '@/payload-types';
import { rteToHtml } from '@/utilities/rteToHtml';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { buildFormFields } from '@/components/blocks/Form/buildFormFields';

type SubmitFormResult =
  | {
    success: true;
  }
  | {
      success: false;
      error?: z.ZodFlattenedError<Record<string, unknown>>;
      values?: Record<string, unknown>;
    };

// only accept same-origin, single-line, reasonably short paths. Any
// client-supplied value that does not match is dropped. This prevents a
// faked `pageUrl` input from injecting URLs into the notification email body.
const sanitizePagePath = (raw: unknown): string => {
  if (typeof raw !== 'string') {
    return '';
  }

  if (raw.length === 0 || raw.length > 2000) {
    return '';
  }

  if (!raw.startsWith('/') || raw.startsWith('//')) {
    return '';
  }

  if ((/[\r\n]/u).test(raw)) {
    return '';
  }

  return raw;
};

const generateMailContent = (
  formData: FormData,
  form: InterfaceForm,
  fields: { name: string }[],
  pagePath: string,
): string => {
  let mailContent = '';

  if (pagePath) {
    mailContent += `URL: ${pagePath}<br><br><br>`;
  }

  mailContent += `${rte1ToPlaintext(form.title)}<br>`;
  mailContent += `${rte1ToPlaintext(form.subtitle)}<br><br><br>`;

  fields.forEach((field) => {
    const {
      name,
    } = field;
    const value = formData.get(name);

    mailContent += `${name}:<br>${value}<br><br><br>`;
  });

  return mailContent;
};

export const submitForm = async (prevState: any, formData: FormData): Promise<SubmitFormResult> => {
  // Read id + page path from the request. Everything else about the
  // form (recipient, subject, fields, list ids) is re-fetched from
  // payload and is not trusted from the client.
  const formId = formData.get(hiddenFormIdFieldName);
  const pagePath = sanitizePagePath(formData.get(hiddenPageUrl));

  if (typeof formId !== 'string' || formId.length === 0) {
    return {
      success: false,
    };
  }

  const locale = (await getLocale()) as Config['locale'];
  const payload = await getPayloadCached();

  let authoritativeForm: InterfaceForm | null;

  try {
    authoritativeForm = (await payload.findByID({
      collection: 'forms',
      depth: 0,
      disableErrors: true,
      id: formId,
      locale,
    })) as InterfaceForm | null;
  } catch {
    authoritativeForm = null;
  }

  if (!authoritativeForm) {
    return {
      success: false,
    };
  }

  // Resolve the form's tenant so we can fetch the matching i18n globals.
  // The privacy checkbox label + error message live on the tenant-scoped
  // i18n globals document, not on the form itself.
  const tenantId = typeof authoritativeForm.tenant === 'string'
    ? authoritativeForm.tenant
    : authoritativeForm.tenant?.id;

  if (!tenantId) {
    return {
      success: false,
    };
  }

  const globalI18nDocs = await payload.find({
    collection: 'i18nGlobals',
    depth: 0,
    limit: 1,
    locale,
    where: {
      tenant: {
        equals: tenantId,
      },
    },
  });

  const globalI18n = globalI18nDocs.docs[0] as I18NGlobal | undefined;

  if (!globalI18n) {
    return {
      success: false,
    };
  }

  // build the authoritative field list (mirrors Form.server.tsx): for
  // newsletter forms this injects firstname/lastname/email/(language),
  // plus the privacy checkbox when enabled. Custom forms keep their
  // stored fields[] and optionally add the privacy checkbox.
  const fields = await buildFormFields({
    form: authoritativeForm,
    globalI18n,
  });

  if (fields.length === 0) {
    return {
      success: true,
    };
  }

  // build the zod validation schema only from the authoritative field
  // list. Any extra form fields posted by the client are ignored.
  const shape: Record<string, any> = {};

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
  if (authoritativeForm.isNewsletterForm === 'custom') {
    if (!authoritativeForm.recipientMail || !authoritativeForm.mailSubject) {
      return {
        success: false,
        values: data,
      };
    }

    const mailResult = await sendMail({
      content: generateMailContent(formData, authoritativeForm, fields, pagePath),
      from: process.env.MAIL_SENDER_ADDRESS,
      subject: authoritativeForm.mailSubject,
      to: authoritativeForm.recipientMail,
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
      listId: authoritativeForm.newsletterFields.newsletterListId,
      listIdTemp: authoritativeForm.newsletterFields.newsletterTemporaryListId,
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
