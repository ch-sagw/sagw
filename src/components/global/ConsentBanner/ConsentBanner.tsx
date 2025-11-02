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
import { useScrollLock } from '@/hooks/useScrollLock';
import { useFocusTrap } from '@/hooks/useFocusTrap';

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
  const [
    isOverlayOpen,
    setIsOverlayOpen,
  ] = useState(false);
  const [
    isBannerOpen,
    setIsBannerOpen,
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

  // Track banner dialog open state
  useEffect(() => {
    const dialog = bannerDialogRef.current;

    if (!dialog || !visible) {
      return undefined;
    }

    setIsBannerOpen(dialog.open);

    // watch for open attribute changes
    const observer = new MutationObserver(() => {
      setIsBannerOpen(dialog.open);
    });

    observer.observe(dialog, {
      attributeFilter: ['open'],
      attributes: true,
    });

    const handleClose = (): void => {
      setIsBannerOpen(false);
    };

    dialog.addEventListener('close', handleClose);

    return (): void => {
      dialog.removeEventListener('close', handleClose);
      observer.disconnect();
    };
  }, [visible]);

  // scroll lock
  useScrollLock(visible || isOverlayOpen);

  // Trap focus
  useFocusTrap({
    condition: isBannerOpen,
    focusTrapRootElement: bannerDialogRef.current ?? undefined,
    ignoreElementsWithClasses: [],
  });

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
    setIsOverlayOpen(true);
  };

  const handleOverlayClose = (): void => {
    setIsOverlayOpen(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <Fragment>
      <dialog
        ref={bannerDialogRef}
        className={styles.consentBanner}
        // @ts-expect-error closedby is a valid HTML attribute but not yet in
        // TypeScript types
        closedby='none'
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
        onClose={handleOverlayClose}
        {...overlay}
      />
    </Fragment>
  );
};
