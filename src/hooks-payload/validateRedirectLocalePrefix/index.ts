import {
  CollectionBeforeValidateHook,
  TypedLocale,
  ValidationError,
} from 'payload';
import { getLocaleCodes } from '@/i18n/payloadConfig';

const localeCodes = getLocaleCodes();

const isTypedLocalePrefix = (prefix: string): prefix is TypedLocale => localeCodes.includes(prefix as TypedLocale);

const checkLocalePrefixedPath = (
  value: string,
  fieldPath: 'from' | 'to',
): { message: string; path: string } | undefined => {

  // check for leading slash
  if ((/^[/\uFF0F]/u).test(value)) {
    return {
      message:
        'A leading slash is not allowed. Start with a locale code, for example "de/my/page".',
      path: fieldPath,
    };
  }

  if (value.length < 2) {
    return {
      message:
        'Must begin with a locale prefix (de, fr, it, en), for example "de/my/page".',
      path: fieldPath,
    };
  }

  const prefix = value.slice(0, 2);

  if (!isTypedLocalePrefix(prefix)) {
    return {
      message:
        'Must begin with a locale prefix (de, fr, it, en), for example "de/my/page".',
      path: fieldPath,
    };
  }

  if (value.length < 3 || value[2] !== '/') {
    return {
      message:
        'Put a "/" right after the locale code (e.g. "de/my/page" or "de/").',
      path: fieldPath,
    };
  }

  return undefined;
};

export const validateRedirectLocalePrefix: CollectionBeforeValidateHook = ({
  data,
  operation,
  originalDoc,
}) => {
  if (![
    'create',
    'update',
  ].includes(operation)) {
    return data;
  }

  if (!data) {
    return data;
  }

  const from = data.from ?? originalDoc?.from;
  const to = data.to ?? originalDoc?.to;

  const errors: {
    message: string;
    path: string;
  }[] = [];

  if (typeof from === 'string') {
    const err = checkLocalePrefixedPath(from, 'from');

    if (err) {
      errors.push(err);
    }
  }

  if (typeof to === 'string') {
    const err = checkLocalePrefixedPath(to, 'to');

    if (err) {
      errors.push(err);
    }
  }

  if (errors.length > 0) {
    throw new ValidationError({
      errors,
    });
  }

  return data;
};
