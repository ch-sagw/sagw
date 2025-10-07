import { CollectionBeforeValidateHook } from 'payload';
import { fieldAdminTitleFieldName } from '@/field-templates/adminTitle';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { InterfaceHeroField } from '@/payload-types';

export const hookAdminTitle: CollectionBeforeValidateHook = ({
  data,
}) => {

  // All hero field-templates have a title, so it's save to just take
  // the generic interface here
  const hero: InterfaceHeroField = data?.hero;
  const lexical = hero?.title;
  const dataString = rte1ToPlaintext(lexical);

  if (data) {
    data[fieldAdminTitleFieldName] = dataString;
  }

  return data;
};
