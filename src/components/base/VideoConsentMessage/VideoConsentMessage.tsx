import React, { useRef } from 'react';
import styles from '@/components/base/VideoConsentMessage/VideoConsentMessage.module.scss';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { i18nConsent } from '@/i18n/content';
import { Config } from '@/payload-types';
import { openConsentOverlayEventName } from '@/components/helpers/cookies';

export type InterfaceVideoConsentMessagePropTypes = {
  pageLanguage: Config['locale'],
};

export const VideoConsentMessage = ({
  pageLanguage,
}: InterfaceVideoConsentMessagePropTypes): React.JSX.Element => {
  const buttonRefOpenCookieSettings = useRef<HTMLButtonElement>(null);

  const openCookieSettingsOverlay = (): void => {
    window.dispatchEvent(new Event(openConsentOverlayEventName));
  };

  return (
    <div
      className={styles.consentMessage}
    >
      <p className={styles.consentMessageTitle}>{i18nConsent.titleExternalContent[pageLanguage as keyof typeof i18nConsent.titleExternalContent]}</p>
      <div className={styles.consentMessageText}>{i18nConsent.messageVideo[pageLanguage as keyof typeof i18nConsent.messageVideo]}</div>
      <Button
        ariaHasPopUp={true}
        ariaLabel={i18nConsent.buttonTextOpenCookieSettings[pageLanguage as keyof typeof i18nConsent.buttonTextOpenCookieSettings]}
        buttonType='button'
        colorMode='dark'
        element='button'
        iconInlineStart={'config' as keyof typeof Icon}
        onClick={openCookieSettingsOverlay}
        ref={buttonRefOpenCookieSettings}
        style='text'
        text={i18nConsent.buttonTextOpenCookieSettings[pageLanguage as keyof typeof i18nConsent.buttonTextOpenCookieSettings]}
      />
    </div>
  );
};
