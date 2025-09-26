import React from 'react';
import styles from '@/components/base/HeaderLogo/HeaderLogo.module.scss';

import sagw from '@/components/base/HeaderLogo/logos/sagw';

const Logos = {
  sagw,
};

interface InterfaceHeaderLogoPropTypes {
  name: keyof typeof Logos;
  className?: string;
}

export const HeaderLogo = ({
  className,
  name,
}: InterfaceHeaderLogoPropTypes): React.JSX.Element => {
  const IconComponent = Logos[name];

  return (
    <span className={`${styles.logo} ${styles[name]} ${className}`}>
      <IconComponent />
    </span>
  );
};
