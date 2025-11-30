import {
  FieldHook, ValidationError,
} from 'payload';

export const validateTenantName: FieldHook = ({
  value,
}) => {
  if (typeof value !== 'string') {
    return value;
  }

  // Check if the value is all lowercase, has no spaces,
  // and contains only alphanumeric characters
  const isValid = (/^[a-z0-9]+$/u).test(value);

  if (!isValid) {
    throw new ValidationError({
      errors: [
        {
          message: 'Name must be all lowercase, contain no spaces, and only alphanumeric characters (a-z, 0-9).',
          path: 'name',
        },
      ],
    });
  }

  return value;
};
