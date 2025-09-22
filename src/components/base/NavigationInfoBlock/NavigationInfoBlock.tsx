import 'server-only';
import React from 'react';
import styles from '@/components/base/NavigationInfoBlock/NavigationInfoBlock.module.scss';

export type InterfaceNavigationInfoBlockPropTypes = {
  title: string;
  text: string;
};

export const NavigationInfoBlock = ({
  title,
  text,
}: InterfaceNavigationInfoBlockPropTypes): React.JSX.Element => (

  // Hidden for screenreaders. NavItems will contain this as hidden text.
  <div
    aria-hidden={true}
    role='presentation'
    className={styles.infoBlock}
  >
    <p className={styles.title}>{title}</p>
    <p className={styles.text}>{text}</p>
  </div>
);
