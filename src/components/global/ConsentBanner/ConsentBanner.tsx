import React, {
  Fragment, useEffect, useRef, useState,
} from 'react';
import styles from '@/components/global/ConsentBanner/ConsentBanner.module.scss';
import {
  Config,
  InterfaceConsentBanner, InterfaceConsentOverlay,
} from '@/payload-types';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { rteToHtml } from '@/utilities/rteToHtml';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { Rte } from '@/components/blocks/Rte/Rte';
import { setCookieConsent } from '@/components/helpers/cookies';
import { ConsentOverlay } from '../ConsentOverlay/ConsentOverlay';

export type InterfaceConsentBannerPropTypes = {
  visible: boolean;
  overlay: InterfaceConsentOverlay;
  pageLanguage: Config['locale'];
} & InterfaceConsentBanner;

export const ConsentBanner = ({
  title,
  text,
  buttonAcceptAll,
  buttonCustomizeSelection,
  buttonDeclineAll,
  visible,
  overlay,
  pageLanguage,
}: InterfaceConsentBannerPropTypes): React.JSX.Element | null => {
  const bannerDialogRef = useRef<HTMLDialogElement>(null);
  const overlayDialogRef = useRef<HTMLDialogElement>(null);
  const [
    isProcessing,
    setIsProcessing,
  ] = useState(false);

  useEffect(() => {
    if (bannerDialogRef.current) {
      if (visible) {
        bannerDialogRef.current.showModal();
      } else {
        bannerDialogRef.current.close();
      }
    }
  }, [visible]);

  const handleAcceptAll = (): void => {
    setIsProcessing(true);
    setCookieConsent({
      analytics: true,
      consentGiven: true,
      essential: true,
      external: true,
    });
    setIsProcessing(false);
    bannerDialogRef.current?.close();
  };

  const handleRejectAll = (): void => {
    setIsProcessing(true);
    setCookieConsent({
      analytics: false,
      consentGiven: true,
      essential: true,
      external: false,
    });
    setIsProcessing(false);
    bannerDialogRef.current?.close();
  };

  const handleCustomize = (): void => {
    overlayDialogRef.current?.showModal();
  };

  if (!visible) {
    return null;
  }

  return (
    <Fragment>
      <dialog
        ref={bannerDialogRef}
        className={styles.consentBanner}
      >
        <SafeHtml
          as='p'
          className={styles.title}
          html={rteToHtml(title)}
        />
        <Rte
          className={styles.text}
          text={text}
          colorMode='light'
          stickyFirstTitle={false}
        />
        <div className={styles.buttons}>
          <Button
            disabled={isProcessing}
            className={styles.button}
            element='button'
            buttonType='button'
            colorMode='light'
            style='filled'
            text={rteToHtml(buttonAcceptAll)}
            onClick={handleAcceptAll}
          />

          <Button
            disabled={isProcessing}
            className={styles.button}
            element='button'
            buttonType='button'
            colorMode='light'
            style='outlined'
            text={rteToHtml(buttonDeclineAll)}
            onClick={handleRejectAll}
          />

          <Button
            disabled={isProcessing}
            className={styles.buttonCustomize}
            element='button'
            buttonType='button'
            colorMode='light'
            style='text'
            text={rteToHtml(buttonCustomizeSelection)}
            iconInlineStart={'config' as keyof typeof Icon}
            onClick={handleCustomize}
          />
        </div>
      </dialog>
      <ConsentOverlay
        ref={overlayDialogRef}
        pageLanguage={pageLanguage}
        {...overlay}
      />
    </Fragment>
  );
};
