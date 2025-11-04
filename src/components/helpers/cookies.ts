export interface InterfaceCookieConsent {
  essential: boolean;
  analytics: boolean;
  external: boolean;
  consentGiven: boolean;
  timestamp: number;
}

export const consentUpdatedEventName = 'consentUpdated';
export const openConsentOverlayEventName = 'openConsentOverlay';

const CONSENT_COOKIE_NAME = 'cookie_consent';

// 12 months
const CONSENT_DURATION = 12 * 30 * 24 * 60 * 60 * 1000;

export const getCookieConsent = (): InterfaceCookieConsent | null => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`));

    if (!cookie) {
      return null;
    }
    const [, cookieValue] = cookie.split('=');

    if (!cookieValue) {
      return null;
    }
    const consent = JSON.parse(decodeURIComponent(cookieValue));

    // Validate consent structure
    if (
      typeof consent !== 'object' ||
      typeof consent.essential !== 'boolean' ||
      typeof consent.analytics !== 'boolean' ||
      typeof consent.consentGiven !== 'boolean' ||
      typeof consent.timestamp !== 'number'
    ) {
      console.warn('Invalid cookie consent structure, resetting consent');

      return null;
    }

    return consent;
  } catch (error) {
    console.error('Error parsing cookie consent:', error);

    return null;
  }
};

export const hasValidConsent = (): boolean => {
  const consent = getCookieConsent();

  if (!consent || !consent.consentGiven) {
    return false;
  }
  const isExpired = Date.now() - consent.timestamp > CONSENT_DURATION;

  if (isExpired) {
    return false;
  }

  return true;
};

export const shouldShowBanner = (): boolean => !hasValidConsent();

export const setCookieConsent = (consent: Omit<InterfaceCookieConsent, 'timestamp' | 'version'>): void => {
  try {
    const fullConsent: InterfaceCookieConsent = {
      ...consent,
      timestamp: Date.now(),
    };
    const cookieValue = encodeURIComponent(JSON.stringify(fullConsent));
    const maxAge = CONSENT_DURATION / 1000;

    document.cookie = `${CONSENT_COOKIE_NAME}=${cookieValue}; path=/; max-age=${maxAge}; samesite=lax${process.env.NODE_ENV === 'production'
      ? '; secure'
      : ''}`;

    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent(consentUpdatedEventName, {
      detail: fullConsent,
    }));

  } catch (error) {
    console.error('Error setting cookie consent:', error);
  }
};
