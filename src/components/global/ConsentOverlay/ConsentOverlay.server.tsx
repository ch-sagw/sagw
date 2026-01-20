import 'server-only';
import React from 'react';
import {
  type Config, InterfaceConsentOverlay,
} from '@/payload-types';
import {
  ConsentOverlayClient, type InterfaceConsentOverlayClientPropTypes,
} from './ConsentOverlay.client';
import { getLocale } from 'next-intl/server';
import { rteToHtml } from '@/utilities/rteToHtml';
import { rte3ToHtml } from '@/utilities/rteToHtml.server';
import { getPayloadCached } from '@/utilities/getPayloadCached';

// helper to safely render optional RTE fields
const safeRteToHtml = (rte: unknown): string | undefined => {
  if (!rte || typeof rte !== 'object' || !('root' in rte)) {
    return undefined;
  }

  return rteToHtml(rte as Parameters<typeof rteToHtml>[0]);
};

export type InterfaceConsentOverlayServerPropTypes = {
  onClose?: () => void;
  onConsentGiven?: () => void;
} & Omit<InterfaceConsentOverlayClientPropTypes, 'onClose' | 'onConsentGiven'>;

// helper function to pre-render ConsentOverlay props
export const preRenderConsentOverlayProps = async (consentOverlay: InterfaceConsentOverlay): Promise<Omit<InterfaceConsentOverlayClientPropTypes, 'onClose' | 'onConsentGiven'>> => {

  const locale = (await getLocale()) as Config['locale'];
  const payload = await getPayloadCached();

  const titleHtml = rteToHtml(consentOverlay.title);
  const textHtml = await rte3ToHtml({
    content: consentOverlay.text,
    locale,
    payload,
  });
  const buttonAcceptAllHtml = rteToHtml(consentOverlay.buttonAcceptAll);
  const buttonAcceptSelectionHtml = rteToHtml(consentOverlay.buttonAcceptSelection);

  const necessaryCookiesTitleHtml = rteToHtml(consentOverlay.necessaryCookies.title);
  const necessaryCookiesTextHtml = await rte3ToHtml({
    content: consentOverlay.necessaryCookies.text,
    locale,
    payload,
  });

  const necessaryCookiesWithHtml = {
    text: necessaryCookiesTextHtml,
    textHtml: necessaryCookiesTextHtml,
    title: necessaryCookiesTitleHtml,
    titleHtml: necessaryCookiesTitleHtml,
    toggleDefault: 'on' as const,
    toggleLabel: safeRteToHtml(consentOverlay.necessaryCookies.toggleLabel),
    toggleLabelHtml: safeRteToHtml(consentOverlay.necessaryCookies.toggleLabel),
    toggleLabelOff: undefined,
    toggleLabelOffHtml: undefined,
    toggleLabelOn: undefined,
    toggleLabelOnHtml: undefined,
  };

  const analyticsPerformanceTitleHtml = rteToHtml(consentOverlay.analyticsPerformance.title);
  const analyticsPerformanceTextHtml = await rte3ToHtml({
    content: consentOverlay.analyticsPerformance.text,
    locale,
    payload,
  });

  const analyticsPerformanceWithHtml = {
    text: analyticsPerformanceTextHtml,
    textHtml: analyticsPerformanceTextHtml,
    title: analyticsPerformanceTitleHtml,
    titleHtml: analyticsPerformanceTitleHtml,
    toggleDefault: (consentOverlay.analyticsPerformance.toggleDefault || 'on') as 'on' | 'off',
    toggleLabel: undefined,
    toggleLabelHtml: undefined,
    toggleLabelOff: safeRteToHtml(consentOverlay.analyticsPerformance.toggleLabelOff),
    toggleLabelOffHtml: safeRteToHtml(consentOverlay.analyticsPerformance.toggleLabelOff),
    toggleLabelOn: safeRteToHtml(consentOverlay.analyticsPerformance.toggleLabelOn),
    toggleLabelOnHtml: safeRteToHtml(consentOverlay.analyticsPerformance.toggleLabelOn),
  };

  const externalContentTitleHtml = rteToHtml(consentOverlay.externalContent.title);
  const externalContentTextHtml = await rte3ToHtml({
    content: consentOverlay.externalContent.text,
    locale,
    payload,
  });

  const externalContentWithHtml = {
    text: externalContentTextHtml,
    textHtml: externalContentTextHtml,
    title: externalContentTitleHtml,
    titleHtml: externalContentTitleHtml,
    toggleDefault: (consentOverlay.externalContent.toggleDefault || 'on') as 'on' | 'off',
    toggleLabel: undefined,
    toggleLabelHtml: undefined,
    toggleLabelOff: safeRteToHtml(consentOverlay.externalContent.toggleLabelOff),
    toggleLabelOffHtml: safeRteToHtml(consentOverlay.externalContent.toggleLabelOff),
    toggleLabelOn: safeRteToHtml(consentOverlay.externalContent.toggleLabelOn),
    toggleLabelOnHtml: safeRteToHtml(consentOverlay.externalContent.toggleLabelOn),
  };

  return {
    analyticsPerformance: analyticsPerformanceWithHtml,
    buttonAcceptAll: buttonAcceptAllHtml,
    buttonAcceptSelection: buttonAcceptSelectionHtml,
    externalContent: externalContentWithHtml,
    necessaryCookies: necessaryCookiesWithHtml,
    text: textHtml,
    title: titleHtml,
  };
};

export const ConsentOverlay = ({
  onClose,
  onConsentGiven,
  ...preRenderedProps
}: InterfaceConsentOverlayServerPropTypes): React.JSX.Element => (
  <ConsentOverlayClient
    {...preRenderedProps}
    onClose={onClose}
    onConsentGiven={onConsentGiven}
  />
);

