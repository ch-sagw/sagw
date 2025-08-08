/* eslint-disable @typescript-eslint/naming-convention */

import {
  ColorMode,
  I18nString, RteConfig2,
} from '../0_base';

/**
 * @group Modules
 */
export interface TextBlock {
  title: I18nString;
  rte: RteConfig2;
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
