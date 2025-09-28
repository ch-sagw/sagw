import React from 'react';
import styles from '@/components/base/HeaderLogo/HeaderLogo.module.scss';
import { ColorMode } from '@/components/base/types/colorMode';

import sagw from '@/components/base/HeaderLogo/logos/sagw';

export const Logos = {
  sagw,
};

export interface InterfaceHeaderLogoPropTypes {
  name: keyof typeof Logos;
  className?: string;
  colorMode: ColorMode;
}

export const HeaderLogo = ({
  className,
  name,
  colorMode,
}: InterfaceHeaderLogoPropTypes): React.JSX.Element => {
  const IconComponent = Logos[name];

  return (
    <span className={`${styles.logo} ${styles[name]} ${className} ${styles[colorMode]}`}>
      <IconComponent />
    </span>
  );
};
