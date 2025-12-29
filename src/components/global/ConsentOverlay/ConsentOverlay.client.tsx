'use client';

import React, {
  forwardRef, useEffect, useState,
} from 'react';
import styles from '@/components/global/ConsentOverlay/ConsentOverlay.module.scss';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { Button } from '@/components/base/Button/Button';
import { Toggle } from '@/components/base/Toggle/Toggle';
import { Icon } from '@/icons';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useTranslations } from 'next-intl';
import {
  getCookieConsent,
  setCookieConsent,
} from '@/components/helpers/cookies';

type ConsentOverlaySection = {
  title: string;
  text: string;
  toggleLabel?: string;
  toggleLabelOff?: string;
  toggleLabelOn?: string;
  toggleDefault: 'on' | 'off';
};

export type InterfaceConsentOverlayClientPropTypes = {
  onClose?: () => void;
  onConsentGiven?: () => void;
  title: string;
  text: string;
  buttonAcceptAll: string;
  buttonAcceptSelection: string;
  necessaryCookies: ConsentOverlaySection & { titleHtml: string; textHtml: string; toggleLabelHtml?: string; toggleLabelOffHtml?: string; toggleLabelOnHtml?: string };
  analyticsPerformance: ConsentOverlaySection & { titleHtml: string; textHtml: string; toggleLabelHtml?: string; toggleLabelOffHtml?: string; toggleLabelOnHtml?: string };
  externalContent: ConsentOverlaySection & { titleHtml: string; textHtml: string; toggleLabelHtml?: string; toggleLabelOffHtml?: string; toggleLabelOnHtml?: string };
};

export const ConsentOverlayClient = forwardRef<HTMLDialogElement, InterfaceConsentOverlayClientPropTypes>(({
  title,
  text,
  buttonAcceptAll,
  buttonAcceptSelection,
  necessaryCookies,
  analyticsPerformance,
  externalContent,
  onClose,
  onConsentGiven,
}, ref): React.JSX.Element => {
  const i18nA11y = useTranslations('a11y');
  const [
    toggleStates,
    setToggleStates,
  ] = useState<Record<string, boolean>>({
    analytics: analyticsPerformance.toggleDefault === 'on',
    external: externalContent.toggleDefault === 'on',
  });

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const sections = [
    {
      data: necessaryCookies,
      key: 'necessary',
    },
    {
      data: analyticsPerformance,
      key: 'analytics',
    },
    {
      data: externalContent,
      key: 'external',
    },
  ] as const;

  // Track dialog open state
  useEffect(() => {
    const dialog = typeof ref === 'object' && ref?.current
      ? ref.current
      : null;

    if (!dialog) {
      return undefined;
    }

    const storedConsent = getCookieConsent();

    queueMicrotask(() => {
      setToggleStates({
        analytics: storedConsent?.analytics ?? false,
        external: storedConsent?.external ?? false,
      });
    });

    const animateClose = (): void => {
      if (!dialog.open || dialog.classList.contains(styles.closing)) {
        return;
      }

      dialog.classList.add(styles.closing);

      const handleAnimationEnd = (): void => {
        dialog.removeEventListener('animationend', handleAnimationEnd);
        dialog.classList.remove(styles.closing);
        setIsOpen(false);
        onClose?.();
        dialog.close();
      };

      dialog.addEventListener('animationend', handleAnimationEnd, {
        once: true,
      });
    };

    const handleCancel = (e: Event): void => {
      // Prevent default close behavior and animate the dismissal
      e.preventDefault();
      animateClose();
    };

    const handleClose = (): void => {
      if (dialog.classList.contains(styles.closing)) {
        return;
      }

      setIsOpen(false);
      onClose?.();
    };

    // Defer initial state set to avoid synchronous setState in effect
    const initialOpenState = dialog.open;

    requestAnimationFrame(() => {
      setIsOpen(initialOpenState);
    });

    // watch for open attribute changes
    const observer = new MutationObserver(() => {
      setIsOpen(dialog.open);
    });

    observer.observe(dialog, {
      attributeFilter: ['open'],
      attributes: true,
    });

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('close', handleClose);

    return (): void => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('close', handleClose);
      observer.disconnect();
    };
  }, [
    ref,
    onClose,
  ]);

  // Trap focus
  useFocusTrap({
    condition: isOpen,
    focusTrapRootRef: typeof ref === 'object'
      ? (ref as React.RefObject<HTMLDialogElement | null>)
      : undefined,
    ignoreElementsWithClasses: [],
  });

  const handleCloseAnimated = (): void => {
    const dialog = typeof ref === 'object' && ref?.current
      ? ref.current
      : null;

    if (!dialog || !dialog.open) {
      return;
    }

    dialog.classList.add(styles.closing);

    // Wait for animation to complete, then close
    const handleAnimationEnd = (): void => {
      dialog.removeEventListener('animationend', handleAnimationEnd);
      dialog.classList.remove(styles.closing);
      dialog.close();
    };

    dialog.addEventListener('animationend', handleAnimationEnd, {
      once: true,
    });
  };

  const handleAcceptSelection = (): void => {
    setCookieConsent({
      analytics: toggleStates.analytics,
      consentGiven: true,
      essential: true,
      external: toggleStates.external,
    });

    onConsentGiven?.();
    handleCloseAnimated();
  };

  const handleAcceptAll = (): void => {
    setCookieConsent({
      analytics: true,
      consentGiven: true,
      essential: true,
      external: true,
    });

    onConsentGiven?.();
    handleCloseAnimated();
  };

  return (
    <dialog
      data-testid='consent-overlay'
      ref={ref}
      className={styles.consentWrapper}
      closedby='closerequest'
    >
      <div className={styles.consentOverlay}>
        <div className={styles.titleLine}>
          <SafeHtml
            id='consent-overlay-title'
            as='h2'
            className={styles.title}
            html={title}
          />
          <button
            data-testid='consent-overlay-close'
            className={styles.closeButton}
            onClick={handleAcceptSelection}
            aria-label={i18nA11y('closeDialog')}
          >
            <Icon name='close' />
          </button>
        </div>
        <SafeHtml
          as='p'
          className={styles.text}
          html={text}
        />

        <ul className={styles.sections}>
          {sections.map(({
            key, data: section,
          }) => (
            <li
              key={key}
              className={styles.section}
            >
              <div className={styles.sectionTitleLine}>
                <SafeHtml
                  as='h3'
                  className={styles.sectionTitle}
                  html={section.titleHtml}
                />

                {('toggleLabelHtml' in section) &&
                  <SafeHtml
                    as='span'
                    className={styles.sectionToggleLabel}
                    html={section.toggleLabelHtml || ''}
                  />
                }

                {('toggleLabelOffHtml' in section) && ('toggleLabelOnHtml' in section) &&
                  <Toggle
                    labelOff={section.toggleLabelOffHtml || ''}
                    labelOn={section.toggleLabelOnHtml || ''}
                    value={key}
                    name={key}
                    checked={toggleStates[key]}
                    onChange={(checked) => {
                      setToggleStates((prev) => ({
                        ...prev,
                        [key]: checked,
                      }));
                    }}
                    hiddenLabel={section.title}
                  />
                }
              </div>

              <SafeHtml
                as='p'
                className={styles.sectionText}
                html={section.textHtml}
              />

            </li>
          ))}
        </ul>

        <div className={styles.buttons}>
          <Button
            className={styles.button}
            element='button'
            buttonType='button'
            colorMode='light'
            style='filled'
            text={buttonAcceptSelection}
            onClick={handleAcceptSelection}
          />

          <Button
            className={styles.button}
            element='button'
            buttonType='button'
            colorMode='light'
            style='outlined'
            text={buttonAcceptAll}
            onClick={handleAcceptAll}
          />

        </div>
      </div>

    </dialog>
  );
});

ConsentOverlayClient.displayName = 'ConsentOverlayClient';
