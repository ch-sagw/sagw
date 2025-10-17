import React, { forwardRef } from 'react';
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
  link: string;
  linkText: string;
}

export const HeaderLogo = forwardRef<HTMLAnchorElement, InterfaceHeaderLogoPropTypes>(({
  className,
  name,
  colorMode,
  link,
  linkText,
}, ref) => {
  const IconComponent = Logos[name];

  return (
    <a
      ref={ref}
      aria-label={linkText}
      href={link}
      className={`${styles.logo} ${styles[name]} ${className} ${styles[colorMode]}`}
    >
      <IconComponent />
    </a>
  );
});

HeaderLogo.displayName = 'HeaderLogo';
