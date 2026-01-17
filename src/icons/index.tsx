import { JSX } from 'react';
import styles from '@/icons/styles.module.scss';

import horizontalInner from '@/icons/keyvisual-lines/horizontal-inner';
import horizontalMiddle from '@/icons/keyvisual-lines/horizontal-middle';
import horizontalOuter from '@/icons/keyvisual-lines/horizontal-outer';
import verticalInner from '@/icons/keyvisual-lines/vertical-inner';
import verticalMiddle from '@/icons/keyvisual-lines/vertical-middle';
import verticalOuter from '@/icons/keyvisual-lines/vertical-outer';

import homeTeaserActivities from '@/icons/home-teasers/activities';
import homeTeaserFunding from '@/icons/home-teasers/funding';
import homeTeaserNetwork from '@/icons/home-teasers/network';

import errorPage from '@/icons/error-page/error';

import facebook from '@/icons/social-media/facebook';
import instagram from '@/icons/social-media/instagram';
import linkedin from '@/icons/social-media/linkedin';
import xIcon from '@/icons/social-media/x';

import arrowLeft from '@/icons/ui/arrow-left';
import arrowRight from '@/icons/ui/arrow-right';
import caretDown from '@/icons/ui/caret-down';
import checked from '@/icons/ui/checked';
import checkmarkFilled from '@/icons/ui/checkmark-filled';
import close from '@/icons/ui/close';
import config from '@/icons/ui/config';
import copy from '@/icons/ui/copy';
import download from '@/icons/ui/download';
import errorFilled from '@/icons/ui/error-filled';
import exportIcon from '@/icons/ui/export';
import externalLink from '@/icons/ui/external-link';
import filePdf from '@/icons/ui/file-pdf';
import language from '@/icons/ui/language';
import longDash from '@/icons/ui/long-dash';
import mail from '@/icons/ui/mail';
import menu from '@/icons/ui/menu';
import minus from '@/icons/ui/minus';
import phone from '@/icons/ui/phone';
import play from '@/icons/ui/play';
import plus from '@/icons/ui/plus';
import square from '@/icons/ui/square';
import warningFilled from '@/icons/ui/warning-filled';
import warning from '@/icons/ui/warning';

const Icons = {
  arrowLeft,
  arrowRight,
  caretDown,
  checked,
  checkmarkFilled,
  close,
  config,
  copy,
  download,
  errorFilled,
  errorPage,
  exportIcon,
  externalLink,
  facebook,
  filePdf,
  homeTeaserActivities,
  homeTeaserFunding,
  homeTeaserNetwork,
  horizontalInner,
  horizontalMiddle,
  horizontalOuter,
  instagram,
  language,
  linkedin,
  longDash,
  mail,
  menu,
  minus,
  phone,
  play,
  plus,
  square,
  verticalInner,
  verticalMiddle,
  verticalOuter,
  warning,
  warningFilled,
  xIcon,
};

interface InterfaceIcon {
  name: keyof typeof Icons;
  className?: string;
}

export const Icon = ({
  name,
  className,
}: InterfaceIcon): JSX.Element => {
  const IconComponent = Icons[name];

  return (
    <span className={`${styles.icon} ${className}`}><IconComponent /></span>

  );

};
