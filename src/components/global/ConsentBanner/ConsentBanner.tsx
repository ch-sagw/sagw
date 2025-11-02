'use client';

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
import {
  consentUpdatedEventName, setCookieConsent, shouldShowBanner,
} from '@/components/helpers/cookies';
import { ConsentOverlay } from '../ConsentOverlay/ConsentOverlay';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useFocusTrap } from '@/hooks/useFocusTrap';

export type InterfaceConsentBannerPropTypes = {
  overlay: InterfaceConsentOverlay;
  pageLanguage: Config['locale'];
} & InterfaceConsentBanner;

export const ConsentBanner = ({
  title,
  text,
  buttonAcceptAll,
  buttonCustomizeSelection,
  buttonDeclineAll,
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
  const [
    isClosing,
    setIsClosing,
  ] = useState(false);
  const [
    shouldShow,
    setShouldShow,
  ] = useState<boolean | null>(null);

  // Check consent status on client side only
  useEffect(() => {
    setShouldShow(shouldShowBanner());

    // Listen for consent updates
    const handleConsentUpdate = (): void => {
      setShouldShow(shouldShowBanner());
    };

    window.addEventListener(consentUpdatedEventName, handleConsentUpdate);

    return (): void => {
      window.removeEventListener(consentUpdatedEventName, handleConsentUpdate);
    };
  }, []);

  const closeBanner = React.useCallback((): void => {
    const dialog = bannerDialogRef.current;

    if (!dialog || !dialog.open) {
      return;
    }

    setIsClosing(true);

    dialog.classList.add(styles.closing);

    // Wait for animation to complete, then close
    const handleAnimationEnd = (): void => {
      dialog.removeEventListener('animationend', handleAnimationEnd);
      dialog.classList.remove(styles.closing);
      setIsClosing(false);

      requestAnimationFrame(() => {
        dialog.close();
      });
    };

    dialog.addEventListener('animationend', handleAnimationEnd, {
      once: true,
    });
  }, []);

  useEffect(() => {
    const dialog = bannerDialogRef.current;

    if (!dialog || shouldShow === null) {
      return;
    }

    if (shouldShow) {
      dialog.showModal();
      dialog.classList.remove(styles.closing);
    } else {
      if (dialog.open) {
        closeBanner();
      }
    }
  }, [
    shouldShow,
    closeBanner,
  ]);

  // Track banner dialog open state
  useEffect(() => {
    const dialog = bannerDialogRef.current;

    if (!dialog || !shouldShow) {
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
  }, [shouldShow]);

  // scroll lock
  useScrollLock(isOverlayOpen);

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
    closeBanner();
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
    closeBanner();
  };

  const handleCustomize = (): void => {
    overlayDialogRef.current?.showModal();
    setIsOverlayOpen(true);
  };

  const handleOverlayClose = (): void => {
    setIsOverlayOpen(false);
  };

  // Return null while checking consent (loading state) to prevent flash
  if (shouldShow === null) {
    return null;
  }

  // After checking consent, render if:
  // - We should show the banner (no consent given), OR
  // - We're closing (keep mounted during animation), OR
  // - Overlay is open (keep mounted for overlay functionality)
  if (!shouldShow && !isClosing && !isOverlayOpen) {
    return null;
  }

  return (
    <Fragment>
      <dialog
        data-testid='consent-banner'
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
        onConsentGiven={closeBanner}
        {...overlay}
      />
    </Fragment>
  );
};
