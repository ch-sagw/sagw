import React from 'react';
import { ColorMode } from '@/components/base/types/colorMode';
import styles from '@/components/base/NavigationInfoBlock/NavigationInfoBlock.module.scss';
import { SafeHtml } from '../SafeHtml/SafeHtml';

export type InterfaceNavigationInfoBlockPropTypes = {
  title?: string;
  text?: string;
  className?: string;
  colorMode: ColorMode;
};

export const NavigationInfoBlock = ({
  title,
  text,
  className,
  colorMode,
}: InterfaceNavigationInfoBlockPropTypes): React.JSX.Element => (

  // Hidden for screenreaders. NavItems will contain this as hidden text.
  <div
    aria-hidden={true}
    role='presentation'
    className={`${styles.infoBlock} ${className} ${styles[colorMode]}`}
  >
    {title &&
      <SafeHtml
        as='p'
        className={styles.title}
        html={title}
      />
    }

    {text &&
      <SafeHtml
        as='p'
        className={styles.text}
        html={text}
      />
    }
  </div>
);
