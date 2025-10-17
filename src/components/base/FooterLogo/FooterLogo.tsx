import React, { forwardRef } from 'react';
import styles from '@/components/base/FooterLogo/FooterLogo.module.scss';
import SagwLogoForFg from '@/components/base/FooterLogo/sagwLogoForFg';

export interface InterfaceFooterLogoPropTypes {
  className?: string;
  link: string;
  linkText: string;
}

export const FooterLogo = forwardRef<HTMLAnchorElement, InterfaceFooterLogoPropTypes>(({
  className,
  link,
  linkText,
}, ref) => (
  <a
    ref={ref}
    aria-label={linkText}
    href={link}
    className={`${styles.logo} ${className}`}
  >
    <SagwLogoForFg />
  </a>
));

FooterLogo.displayName = 'FooterLogo';
