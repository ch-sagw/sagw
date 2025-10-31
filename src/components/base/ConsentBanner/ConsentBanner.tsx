import React from 'react';
import styles from '@/components/base/ConsentBanner/ConsentBanner.module.scss';
import { InterfaceConsentBanner } from '@/payload-types';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { rteToHtml } from '@/utilities/rteToHtml';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { Rte } from '@/components/blocks/Rte/Rte';

export type InterfaceConsentBannerPropTypes = {} & InterfaceConsentBanner;

export const ConsentBanner = ({
  title,
  text,
  buttonAcceptAll,
  buttonCustomizeSelection,
  buttonDeclineAll,
}: InterfaceConsentBannerPropTypes): React.JSX.Element => (
  <section className={styles.consentBanner}>
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
        className={styles.button}
        element='button'
        buttonType='button'
        colorMode='light'
        style='filled'
        text={rteToHtml(buttonAcceptAll)}
        onClick={() => {
          console.log('clicked: accept');
        }}
      />

      <Button
        className={styles.button}
        element='button'
        buttonType='button'
        colorMode='light'
        style='outlined'
        text={rteToHtml(buttonDeclineAll)}
        onClick={() => {
          console.log('clicked: decline');
        }}
      />

      <Button
        className={styles.buttonCustomize}
        element='button'
        buttonType='button'
        colorMode='light'
        style='text'
        text={rteToHtml(buttonCustomizeSelection)}
        iconInlineStart={'config' as keyof typeof Icon}
        onClick={() => {
          console.log('clicked: customize');
        }}
      />
    </div>
  </section>
);
