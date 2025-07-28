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
 * Example usage:
 * - promotion landing page
 *
 * @group Sections
 */
export interface HeroSectionReducedColorBright {
  title: I18nString;
}

/**
 * Example usage:
 * - early career award
 *
 * @group Sections
 */
export interface HeroSectionReducedWhite {
  title: I18nString;
}

/**
 * @group Sections
 */
export interface HeroSectionArticle {
  title: I18nString;
  subtitle: I18nString;
  author: Author;
  date: Date;
  exportButtonTitle: I18nString;
}
