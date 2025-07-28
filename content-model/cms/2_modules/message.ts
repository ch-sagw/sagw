/* eslint-disable @typescript-eslint/naming-convention */

import {
  ColorScheme, I18nString, LinkInternal,
} from '../0_base';

/**
 * @group Modules
 */
export interface Message {
  title: I18nString;
  message: I18nString;
  type: 'success' | 'warning' | 'error';
  colorMode: ColorScheme;
  linkInternal?: LinkInternal;
}
