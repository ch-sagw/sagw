'use client';

import React, {
  useEffect, useRef, useState,
} from 'react';
import styles from '@/components/global/ConsentBanner/ConsentBanner.module.scss';
import { InterfaceConsentBanner } from '@/payload-types';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { rteToHtml } from '@/utilities/rteToHtml';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { Rte } from '@/components/blocks/Rte/Rte';
import {
  consentUpdatedEventName, openConsentOverlayEventName, setCookieConsent, shouldShowBanner,
} from '@/components/helpers/cookies';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useScrollLock } from '@/hooks/useScrollLock';

export type InterfaceConsentBannerPropTypes = {} & InterfaceConsentBanner;

export const ConsentBanner = ({
  title,
  text,
  buttonAcceptAll,
  buttonCustomizeSelection,
  buttonDeclineAll,
}: InterfaceConsentBannerPropTypes): React.JSX.Element | null => {
  const bannerDialogRef = useRef<HTMLDialogElement>(null);
  const [
    isProcessing,
    setIsProcessing,
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
  ] = useState<boolean | null>(() => shouldShowBanner());

  // Check consent status on client side only
  useEffect(() => {
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
        // Defer closeBanner to avoid synchronous setState in effect
        requestAnimationFrame(() => {
          closeBanner();
        });
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

  useScrollLock(isBannerOpen);

  // Trap focus
  const [
    focusTrapRootEl,
    setFocusTrapRootEl,
  ] = useState<HTMLDialogElement | null>(null);

  useEffect(() => {
    setFocusTrapRootEl(bannerDialogRef.current);
  }, [isBannerOpen]);

  useFocusTrap({
    condition: isBannerOpen,
    focusTrapRootElement: focusTrapRootEl ?? undefined,
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
    // Dispatch event to open the consent overlay (handled by Footer)
    window.dispatchEvent(new CustomEvent(openConsentOverlayEventName));
  };

  // Return null while checking consent (loading state) to prevent flash
  if (shouldShow === null) {
    return null;
  }

  // After checking consent, render if:
  // - We should show the banner (no consent given), OR
  // - We're closing (keep mounted during animation)
  if (!shouldShow && !isClosing) {
    return null;
  }

  return (
    <dialog
      aria-labelledby='consent-banner-title'
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
        id='consent-banner-title'
      />
      <Rte
        className={styles.text}
        text={text}
        colorMode='light'
        stickyFirstTitle={false}
      />
      <ul className={styles.buttons}>
        <li>
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
        </li>

        <li>
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
        </li>

        <li>
          <Button
            ariaHasPopUp={true}
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
        </li>
      </ul>
    </dialog>
  );
};
