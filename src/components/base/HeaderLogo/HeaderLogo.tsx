import { forwardRef } from 'react';
import styles from '@/components/base/HeaderLogo/HeaderLogo.module.scss';
import { ColorMode } from '@/components/base/types/colorMode';

import codices from '@/components/base/HeaderLogo/logos/codices';
import collrom from '@/components/base/HeaderLogo/logos/collrom';
import notSagw from '@/components/base/HeaderLogo/logos/not-sagw';
import sag from '@/components/base/HeaderLogo/logos/sag';
import sago from '@/components/base/HeaderLogo/logos/sago';
import sagw from '@/components/base/HeaderLogo/logos/sagw';
import sanas from '@/components/base/HeaderLogo/logos/sanas';
import saute from '@/components/base/HeaderLogo/logos/saute';
import seg from '@/components/base/HeaderLogo/logos/seg';
import sga from '@/components/base/HeaderLogo/logos/sga';
import sgas from '@/components/base/HeaderLogo/logos/sgas';
import sgavl from '@/components/base/HeaderLogo/logos/sgavl';
import sgb from '@/components/base/HeaderLogo/logos/sgb';
import sgbe from '@/components/base/HeaderLogo/logos/sgbe';
import sgbf from '@/components/base/HeaderLogo/logos/sgbf';
import sgg from '@/components/base/HeaderLogo/logos/sgg';
import sggf from '@/components/base/HeaderLogo/logos/sggf';
import sgjf from '@/components/base/HeaderLogo/logos/sgjf';
import sgks from '@/components/base/HeaderLogo/logos/sgks';
import sgmoik from '@/components/base/HeaderLogo/logos/sgmoik';
import sgr from '@/components/base/HeaderLogo/logos/sgr';
import sgss from '@/components/base/HeaderLogo/logos/sgss';
import sgtk from '@/components/base/HeaderLogo/logos/sgtk';
import smg from '@/components/base/HeaderLogo/logos/smg';
import spg from '@/components/base/HeaderLogo/logos/spg';
import sseh from '@/components/base/HeaderLogo/logos/sseh';
import ssg from '@/components/base/HeaderLogo/logos/ssg';
import sslas from '@/components/base/HeaderLogo/logos/sslas';
import sthg from '@/components/base/HeaderLogo/logos/sthg';
import svav from '@/components/base/HeaderLogo/logos/svav';

import Link from 'next/link';

export const Logos = {
  codices,
  collrom,
  // not-sagw will not be used in production
  'not-sagw': notSagw,
  sag,
  sago,
  sagw,
  sanas,
  saute,
  seg,
  sga,
  sgas,
  sgavl,
  sgb,
  sgbe,
  sgbf,
  sgg,
  sggf,
  sgjf,
  sgks,
  sgmoik,
  sgr,
  sgss,
  sgtk,
  smg,
  spg,
  sseh,
  ssg,
  sslas,
  sthg,
  svav,
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
    <Link
      ref={ref}
      aria-label={linkText}
      href={link}
      className={`${styles.logo} ${styles[name]} ${className} ${styles[colorMode]}`}
      prefetch={true}
    >
      <IconComponent />
    </Link>
  );
});

HeaderLogo.displayName = 'HeaderLogo';
