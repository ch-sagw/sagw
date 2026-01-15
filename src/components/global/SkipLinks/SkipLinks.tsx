import 'server-only';
import React from 'react';
import styles from '@/components/global/SkipLinks/SkipLinks.module.scss';
import { SkipLink } from '@/components/base/SkipLink/SkipLink';
import { getTranslations } from 'next-intl/server';

export const SkipLinks = async (): Promise<React.JSX.Element> => {
  const internalI18nSkipLinks = await getTranslations('skipLinks');

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
