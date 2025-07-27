/* eslint-disable @typescript-eslint/naming-convention */

import {
  ColorMode,
  I18nString,
  Logo,
  PageRef,
} from '../0_base';

/**
 * @group Base
 */
export interface SubNavItem {
  text: I18nString;
  slug: PageRef;
}

/**
 * @group Base
 */
export interface MainNavItem {
  text: I18nString;
  children?: SubNavItem[];
  slug?: PageRef;
}

/**
 * @group Modules
 */
export interface LangSwitchItem {
  text: string;
  languageCode: 'de | fr | it | en';
}

/**
 * @group Modules
 */
export interface Header {
  logo: Logo;
  navigation: MainNavItem[];
  languageSwitch: LangSwitchItem[];
  metaNavigation: SubNavItem[];

  // TODO: neccessary, or do we derivate this from the parent element?
  colorSettings?: ColorMode;
}
