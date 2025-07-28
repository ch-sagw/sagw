/* eslint-disable @typescript-eslint/naming-convention */

import {
  ColorMode,
  Logo,
  MainNavItem,
  SubNavItem,
} from '../0_base';

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
