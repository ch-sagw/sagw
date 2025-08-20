/* eslint-disable @typescript-eslint/naming-convention */

import {
  ColorMode,
  Logo,
  MainNavItem,
  MetaNavItem,
} from '../0_base';

/**
 * @group Modules
 */
export interface Header {
  logo: Logo;
  navigation: MainNavItem[];
  metaNavigation: MetaNavItem[];

  // TODO: neccessary, or do we derivate this from the parent page?
  colorSettings?: ColorMode;
}
