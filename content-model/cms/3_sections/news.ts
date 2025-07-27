/* eslint-disable @typescript-eslint/naming-convention */

import {
  ColorModeReduced,
  I18nString, LinkInternal,
} from '../0_base';

/**
 * @group Sections
 */
export interface News {
  title: I18nString;
  text: I18nString;
  date: Date;
  link: LinkInternal;
}

/**
 * @group Sections
 */
export interface NewsSection {
  title: I18nString;
  items: News[];
  allNewsLink: LinkInternal;
  colorMode: ColorModeReduced;
}
