import 'server-only';

import React from 'react';
import styles from '@/components/base/SkipLink/SkipLink.module.scss';

export type InterfaceSkipLinkPropTypes = {
  href: string;
  label: string;
};

export const SkipLink = ({
  href,
  label,
}: InterfaceSkipLinkPropTypes): React.JSX.Element => (
  <a
    className={styles.skipLink}
    href={href}
  >
    {label}
  </a>
);
