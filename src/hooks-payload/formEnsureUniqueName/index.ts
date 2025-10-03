import {
  FieldHook, ValidationError,
} from 'payload';

export const formEnsureUniqueName: FieldHook = ({
  value,
}) => {
  if (!Array.isArray(value)) {
    return value;
  }

  const seen = new Set<string>();

  for (const [
    idx,
    block,
  ] of value.entries()) {

    const fieldName = block?.name;

    if (fieldName) {
      if (seen.has(fieldName)) {
        throw new ValidationError({
          errors: [
            {
              label: 'Label',
              message: `Duplicate label "${fieldName}" is not allowed.`,
              path: `fields.${idx}.label`,
            },
          ],
        });
      }
      seen.add(fieldName);
    }
  }

  return value;
};
