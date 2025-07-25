/* eslint-disable @typescript-eslint/naming-convention */

import {
  Logo, MainNavItem, SubNavItem,
} from '../0_base';

export interface LangSwitchItem {
  text: string;
  languageCode: 'de | fr | it | en';
}

export interface Navigation {
  logo: Logo;
  navigation: MainNavItem[];
  languageSwitch: LangSwitchItem[];
  metaNavigation: SubNavItem[];
}
