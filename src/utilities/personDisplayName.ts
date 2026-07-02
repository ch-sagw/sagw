import { Person } from '@/payload-types';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { rteToHtml } from '@/utilities/rteToHtml';

type PersonDisplayNameFields = Pick<Person, 'fullName' | 'prefix'>;

export const personDisplayNamePlain = (person: PersonDisplayNameFields): string | undefined => {
  if (!person.fullName) {
    return undefined;
  }

  const prefix = rte1ToPlaintext(person.prefix);

  if (!prefix) {
    return person.fullName;
  }

  return `${prefix} ${person.fullName}`;
};

export const personDisplayNameHtml = (person: PersonDisplayNameFields): string | undefined => {
  if (!person.fullName) {
    return undefined;
  }

  const prefixHtml = rteToHtml(person.prefix);

  if (!prefixHtml) {
    return person.fullName;
  }

  return `${prefixHtml} ${person.fullName}`;
};
