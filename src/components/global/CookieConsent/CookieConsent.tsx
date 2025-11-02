'use client';

import React, {
  useEffect, useState,
} from 'react';
import {
  Config,
  InterfaceConsentBanner, InterfaceConsentOverlay,
} from '@/payload-types';
import { ConsentBanner } from '@/components/global/ConsentBanner/ConsentBanner';
import {
  consentUpdatedEventName, shouldShowBanner,
} from '@/components/helpers/cookies';

export type InterfaceCookieConsentPropTypes = {
  banner: InterfaceConsentBanner;
  overlay: InterfaceConsentOverlay;
  pageLanguage: Config['locale'];
};

export const CookieConsent = ({
  banner,
  overlay,
  pageLanguage,
}: InterfaceCookieConsentPropTypes): React.JSX.Element | null => {
  const [
    showBanner,
    setShowBanner,
  ] = useState(false);
  const [
    isLoaded,
    setIsLoaded,
  ] = useState(false);

  useEffect(() => {
    setShowBanner(shouldShowBanner());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleConsentChange = (): void => {
      setShowBanner(shouldShowBanner());
    };

    window.addEventListener('storage', handleConsentChange);
    window.addEventListener(consentUpdatedEventName, handleConsentChange);

    return (): void => {
      window.removeEventListener('storage', handleConsentChange);
      window.removeEventListener(consentUpdatedEventName, handleConsentChange);
    };
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <ConsentBanner
      {...banner}
      visible={showBanner}
      overlay={overlay}
      pageLanguage={pageLanguage}
    />
  );
};
