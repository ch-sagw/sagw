import React, {
  forwardRef, useEffect, useState,
} from 'react';
import styles from '@/components/global/ConsentOverlay/ConsentOverlay.module.scss';
import {
  Config, InterfaceConsentOverlay,
} from '@/payload-types';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { rteToHtml } from '@/utilities/rteToHtml';
import { Button } from '@/components/base/Button/Button';
import { Toggle } from '@/components/base/Toggle/Toggle';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { Icon } from '@/icons';
import { i18nA11y } from '@/i18n/content';
import { useFocusTrap } from '@/hooks/useFocusTrap';

export type InterfaceConsentOverlayPropTypes = {
  pageLanguage: Config['locale'];
  onClose?: () => void;
} & InterfaceConsentOverlay;

export const ConsentOverlay = forwardRef<HTMLDialogElement, InterfaceConsentOverlayPropTypes>(({
  title,
  text,
  buttonAcceptAll,
  buttonAcceptSelection,
  necessaryCookies,
  analyticsPerformance,
  externalContent,
  pageLanguage,
  onClose,
}, ref): React.JSX.Element => {
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

    setIsOpen(dialog.open);

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
    focusTrapRootElement: typeof ref === 'object' && ref?.current
      ? ref.current
      : undefined,
    ignoreElementsWithClasses: [],
  });

  const handleClose = (): void => {
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

  return (
    <dialog
      ref={ref}
      className={styles.consentWrapper}
      // @ts-expect-error closedby is a valid HTML attribute but not yet in
      // TypeScript types
      closedby='closerequest'
    >
      <div className={styles.consentOverlay}>
        <div className={styles.titleLine}>
          <SafeHtml
            as='h2'
            className={styles.title}
            html={rteToHtml(title)}
          />
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label={i18nA11y.closeDialog[pageLanguage]}
          >
            <Icon name='close' />
          </button>
        </div>
        <SafeHtml
          as='p'
          className={styles.text}
          html={rteToHtml(text)}
        />

        <div className={styles.sections}>
          {sections.map(({
            key, data: section,
          }) => (
            <div
              key={key}
              className={styles.section}
            >
              <div className={styles.sectionTitleLine}>
                <SafeHtml
                  as='h3'
                  className={styles.sectionTitle}
                  html={rteToHtml(section.title)}
                />

                {('toggleLabel' in section) &&
                  <SafeHtml
                    as='span'
                    className={styles.sectionToggleLabel}
                    html={rteToHtml(section.toggleLabel)}
                  />
                }

                {('toggleLabelOff' in section) && ('toggleLabelOn' in section) &&
                  <Toggle
                    labelOff={rteToHtml(section.toggleLabelOff)}
                    labelOn={rteToHtml(section.toggleLabelOn)}
                    value={key}
                    name={key}
                    checked={true}
                    hiddenLabel={rte1ToPlaintext(section.title)}
                  />
                }
              </div>

              <SafeHtml
                as='p'
                className={styles.sectionText}
                html={rteToHtml(section.text)}
              />

            </div>
          ))}
        </div>

        <div className={styles.buttons}>
          <Button
            className={styles.button}
            element='button'
            buttonType='button'
            colorMode='light'
            style='filled'
            text={rteToHtml(buttonAcceptSelection)}
            onClick={() => {
              console.log('clicked: decline');
            }}
          />

          <Button
            className={styles.button}
            element='button'
            buttonType='button'
            colorMode='light'
            style='outlined'
            text={rteToHtml(buttonAcceptAll)}
            onClick={() => {
              console.log('clicked: decline');
            }}
          />

        </div>
      </div>

    </dialog>
  );
});

ConsentOverlay.displayName = 'ConsentOverlay';
