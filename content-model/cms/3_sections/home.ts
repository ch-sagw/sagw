/* eslint-disable @typescript-eslint/naming-convention */

import {
  DecorativeIcon, I18nString, LinkInternal,
} from '../0_base';

export interface HomeSection {
  category: I18nString;
  title: I18nString;
  text: I18nString;
  link: LinkInternal;
  icon: DecorativeIcon;
}
