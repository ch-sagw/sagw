import React from 'react';
import styles from '@/components/global/SkipLinks/SkipLinks.module.scss';
import { SkipLink } from '@/components/base/SkipLink/SkipLink';
import { useTranslations } from 'next-intl';

export const SkipLinks = (): React.JSX.Element => {
  const internalI18nSkipLinks = useTranslations('skipLinks');

  return (
    <section
      aria-label={internalI18nSkipLinks('sectionLabel')}
      className={styles.skipLinks}
    >
      <SkipLink
        href='#content'
        label={internalI18nSkipLinks('skipToContent')}
      />
    </section>
  );
};
