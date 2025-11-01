import React, { useState } from 'react';
import styles from '@/components/global/ConsentBanner/ConsentBanner.module.scss';
import { cva } from 'cva';
import {
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
} & InterfaceConsentBanner;

const classes = cva([styles.consentBanner], {
  variants: {
    visible: {
      false: [undefined],
      true: [styles.visible],
    },
  },
});

export const ConsentBanner = ({
  title,
  text,
  buttonAcceptAll,
  buttonCustomizeSelection,
  buttonDeclineAll,
  visible,
  overlay,
}: InterfaceConsentBannerPropTypes): React.JSX.Element | null => {
  const [
    showSettings,
    setShowSettings,
  ] = useState(false);
  const [
    isProcessing,
    setIsProcessing,
  ] = useState(false);

  if (!visible) {
    return null;
  }

  const handleAcceptAll = (): void => {
    setIsProcessing(true);
    setCookieConsent({
      analytics: true,
      consentGiven: true,
      essential: true,
      external: true,
    });
    setIsProcessing(false);
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
  };

  if (showSettings) {
    return (
      // <CookieSettings
      //   onBack={() => setShowSettings(false)}
      //   onClose={() => setShowSettings(false)}
      // />
      <ConsentOverlay
        {...overlay}
        visible={true}
      />
    );
  }

  return (
    <section className={classes({
      visible,
    })}>
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
          onClick={() => setShowSettings(true)}
        />
      </div>
    </section>
  );
};
