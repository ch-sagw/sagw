/**
 * Get rte fields from consent banner and consent overlay.
 * -> generate and store paths for all internal links in RTE fields
 */

import { CollectionBeforeValidateHook } from 'payload';
import { generateRteLinkPaths } from '@/utilities/generateRteLinkPaths';
import {
  InterfaceConsentBanner, InterfaceConsentOverlay,
} from '@/payload-types';

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
    const bannerData: InterfaceConsentBanner = data.banner;
    const overlayData: InterfaceConsentOverlay = data.overlay;

    const bannerTextProcessed = await generateRteLinkPaths(bannerData.text, req.payload);
    const overlayTextProcessed = await generateRteLinkPaths(overlayData.text, req.payload);
    const overlayNeccessaryCookiesTextProcessed = await generateRteLinkPaths(overlayData.necessaryCookies.text, req.payload);
    const overlayAnalyticsTextProcessed = await generateRteLinkPaths(overlayData.analyticsPerformance.text, req.payload);
    const overlayExternalContentTextProcessed = await generateRteLinkPaths(overlayData.externalContent.text, req.payload);

    // false positive by the linter: all promises are resolved by now...
    /* eslint-disable require-atomic-updates */
    data.banner.text = bannerTextProcessed;
    data.overlay.text = overlayTextProcessed;
    data.overlay.necessaryCookies.text = overlayNeccessaryCookiesTextProcessed;
    data.overlay.analyticsPerformance.text = overlayAnalyticsTextProcessed;
    data.overlay.externalContent.text = overlayExternalContentTextProcessed;
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
