import styles from '@/components/base/VideoConsentMessage/VideoConsentMessage.module.scss';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { i18nConsent } from '@/i18n/content';
import { openConsentOverlayEventName } from '@/components/helpers/cookies';
import { useLocale } from 'next-intl';
import { TypedLocale } from 'payload';

export const VideoConsentMessage = (): React.JSX.Element => {
  const locale = useLocale() as TypedLocale;
  const openCookieSettingsOverlay = (): void => {
    window.dispatchEvent(new Event(openConsentOverlayEventName));
  };

  return (
    <div
      className={styles.consentMessage}
    >
      <p className={styles.consentMessageTitle}>{i18nConsent.titleExternalContent[locale]}</p>
      <div className={styles.consentMessageText}>{i18nConsent.messageVideo[locale]}</div>
      <Button
        ariaHasPopUp={true}
        ariaLabel={i18nConsent.buttonTextOpenCookieSettings[locale]}
        buttonType='button'
        colorMode='dark'
        element='button'
        iconInlineStart={'config' as keyof typeof Icon}
        onClick={openCookieSettingsOverlay}
        style='text'
        text={i18nConsent.buttonTextOpenCookieSettings[locale]}
      />
    </div>
  );
};
