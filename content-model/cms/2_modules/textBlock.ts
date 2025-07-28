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
 * Example usage:
 * - early career award
 *
 * @group Modules
 *
 */
export interface TextBlockColor extends TextBlock {
  colorMode: ColorMode;
}
