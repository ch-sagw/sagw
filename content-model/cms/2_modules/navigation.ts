/* eslint-disable @typescript-eslint/naming-convention */

import {
  Logo, MainNavItem, SubNavItem,
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
export interface Navigation {
  logo: Logo;
  navigation: MainNavItem[];
  languageSwitch: LangSwitchItem[];
  metaNavigation: SubNavItem[];
}
