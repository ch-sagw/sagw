import React, { forwardRef } from 'react';
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

export type InterfaceConsentOverlayPropTypes = {
  pageLanguage: Config['locale']
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
}, ref): React.JSX.Element => {
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

  const handleClose = (): void => {
    if (typeof ref === 'object' && ref?.current) {
      ref.current.close();
    }
  };

  return (
    <dialog
      ref={ref}
      className={styles.consentWrapper}
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
