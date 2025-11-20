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
  const openCookieSettingsOverlay = (): void => {
    window.dispatchEvent(new Event(openConsentOverlayEventName));
  };

  return (
    <div
      className={styles.consentMessage}
    >
      <p className={styles.consentMessageTitle}>{i18nConsent.titleExternalContent[pageLanguage]}</p>
      <div className={styles.consentMessageText}>{i18nConsent.messageVideo[pageLanguage]}</div>
      <Button
        ariaHasPopUp={true}
        ariaLabel={i18nConsent.buttonTextOpenCookieSettings[pageLanguage]}
        buttonType='button'
        colorMode='dark'
        element='button'
        iconInlineStart={'config' as keyof typeof Icon}
        onClick={openCookieSettingsOverlay}
        style='text'
        text={i18nConsent.buttonTextOpenCookieSettings[pageLanguage]}
      />
    </div>
  );
};
