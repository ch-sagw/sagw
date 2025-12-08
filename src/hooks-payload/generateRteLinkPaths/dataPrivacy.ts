/**
 * Get rte field from data privacy checkbox
 * -> generate and store paths for all internal links in RTE fields
 */

import { CollectionBeforeValidateHook } from 'payload';
import { generateRteLinkPaths } from '@/utilities/generateRteLinkPaths';
import { InterfaceI18NForms } from '@/payload-types';

export const hookGenerateRteLinkPaths: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
}) => {
  if (!data || !req?.payload) {
    return data;
  }

  if (![
    'create',
    'update',
  ].includes(operation)) {
    return data;
  }

  try {
    const i18nFormData: InterfaceI18NForms = data.forms;

    const checkboxTextProcessed = await generateRteLinkPaths(i18nFormData.dataPrivacyCheckbox.dataPrivacyCheckboxText, req.payload);

    // false positive by the linter: all promises are resolved by now...
    /* eslint-disable require-atomic-updates */
    data.forms.dataPrivacyCheckbox.dataPrivacyCheckboxText = checkboxTextProcessed;
    /* eslint-enable require-atomic-updates */

    return data;

  } catch (error) {
    console.error('Error generating RTE link paths:', error);
    console.error('Operation:', operation);
    console.error('Data sample:', JSON.stringify(data)
      .substring(0, 500));

    // Return original data if processing fails
    return data;
  }

};
