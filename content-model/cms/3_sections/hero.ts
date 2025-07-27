/* eslint-disable @typescript-eslint/naming-convention */

import {
  Author, ColorMode, I18nString, LinkInternal,
} from '../0_base';

/**
 * @group Sections
 */
export interface HeroSection {
  sideTitle: I18nString;
  title: I18nString;
  text: I18nString;
  link: LinkInternal;
  colorMode: ColorMode;
}

/**
 * @group Sections
 */
export interface HeroArticleSection {
  title: I18nString;
  subtitle: I18nString;
  author: Author;
  date: Date;
  exportButtonTitle: I18nString;
}
