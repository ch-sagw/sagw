import horizontalInner from '@/icons/keyvisual-lines/horizontal-inner';
import horizontalMiddle from '@/icons/keyvisual-lines/horizontal-middle';
import horizontalOuter from '@/icons/keyvisual-lines/horizontal-outer';
import verticalInner from '@/icons/keyvisual-lines/vertical-inner';
import verticalMiddle from '@/icons/keyvisual-lines/vertical-middle';
import verticalOuter from '@/icons/keyvisual-lines/vertical-outer';

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
import { JSX } from 'react';

type IconsMap = {
  [key: string]: JSX.Element;
};

const Icons: IconsMap = {
  arrowLeft: arrowLeft(),
  arrowRight: arrowRight(),
  caretDown: caretDown(),
  checked: checked(),
  checkmarkFilled: checkmarkFilled(),
  close: close(),
  config: config(),
  copy: copy(),
  download: download(),
  errorFilled: errorFilled(),
  exportIcon: exportIcon(),
  externalLink: externalLink(),
  facebook: facebook(),
  filePdf: filePdf(),
  horizontalInner: horizontalInner(),
  horizontalMiddle: horizontalMiddle(),
  horizontalOuter: horizontalOuter(),
  instagram: instagram(),
  language: language(),
  linkedin: linkedin(),
  longDash: longDash(),
  mail: mail(),
  menu: menu(),
  minus: minus(),
  phone: phone(),
  play: play(),
  plus: plus(),
  square: square(),
  verticalInner: verticalInner(),
  verticalMiddle: verticalMiddle(),
  verticalOuter: verticalOuter(),
  warning: warning(),
  warningFilled: warningFilled(),
  xIcon: xIcon(),
};

interface InterfaceIcon {
  name: keyof typeof Icons;
}

export const Icon = ({
  name,
}: InterfaceIcon): JSX.Element => Icons[name];
