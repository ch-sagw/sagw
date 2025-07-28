/* eslint-disable @typescript-eslint/naming-convention */

import {
  ColorMode,
  I18nString, Rte,
} from '../0_base';

/**
 * @group Modules
 */
export interface TextBlock {
  title: I18nString;
  rte: Rte;
  copyButtonText: I18nString;
}

/**
 * @group Modules
 * Example usage:
 * - early career award
 */
export interface TextBlockColor {
  title: I18nString;
  rte: Rte;
  copyButtonText: I18nString;
  colorMode: ColorMode
}
