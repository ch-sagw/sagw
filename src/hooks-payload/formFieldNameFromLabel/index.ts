import validator from 'validator';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';

export const formFieldNameFromLabel = ({
  siblingData,
}: Partial<any>): string => {
  let labelText;

  if ('label' in siblingData && siblingData.label) {
    labelText = rte1ToPlaintext(siblingData.label);
  }

  if (!labelText) {
    return '';
  }

  // Lowercase, trim, replace spaces with dashes
  const name = labelText.toLowerCase()
    .trim()
    .replace(/\s+/gu, '-');

  // Whitelist only letters, numbers, dashes, underscores
  const whitelistedName = validator.whitelist(name, 'a-z0-9-_');

  return whitelistedName;
};
