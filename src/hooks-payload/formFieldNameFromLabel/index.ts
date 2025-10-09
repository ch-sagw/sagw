import validator from 'validator';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { Form as InterfaceForm } from '@/payload-types';

export const formFieldNameFromLabel = ({
  siblingData,
}: Partial<any>): string => {
  if (!siblingData?.label) {
    return '';
  }

  const formElement: NonNullable<NonNullable<InterfaceForm['fields']>>[number] = siblingData;

  const labelText = rte1ToPlaintext(formElement?.label);

  // Lowercase, trim, replace spaces with dashes
  const name = labelText.toLowerCase()
    .trim()
    .replace(/\s+/gu, '-');

  // Whitelist only letters, numbers, dashes, underscores
  const whitelistedName = validator.whitelist(name, 'a-z0-9-_');

  return whitelistedName;
};
