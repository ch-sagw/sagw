import styles from '@/components/base/VideoConsentMessage/VideoConsentMessage.module.scss';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { openConsentOverlayEventName } from '@/components/helpers/cookies';
import { useTranslations } from 'next-intl';

export const VideoConsentMessage = (): React.JSX.Element => {
  const i18nConsent = useTranslations('consent');
  const openCookieSettingsOverlay = (): void => {
    window.dispatchEvent(new Event(openConsentOverlayEventName));
  };

  return (
    <div
      className={styles.consentMessage}
    >
      <p className={styles.consentMessageTitle}>{i18nConsent('titleExternalContent')}</p>
      <div className={styles.consentMessageText}>{i18nConsent('messageVideo')}</div>
      <Button
        ariaHasPopUp={true}
        ariaLabel={i18nConsent('buttonTextOpenCookieSettings')}
        buttonType='button'
        colorMode='dark'
        element='button'
        iconInlineStart={'config' as keyof typeof Icon}
        onClick={openCookieSettingsOverlay}
        style='text'
        text={i18nConsent('buttonTextOpenCookieSettings')}
      />
    </div>
  );
};
