/* eslint-disable @typescript-eslint/naming-convention */

import {
  ColorScheme, I18nString, LinkInternal,
} from '../0_base';

/**
 * @group Modules
 */
export interface FormMessage {
  title: I18nString;
  messageSuccess: I18nString;
  colorMode: ColorScheme;
  messageError: I18nString;
  messageWarn?: I18nString;
  linkInternal?: LinkInternal;
}

/**
 * @group Modules
 */
type GlobalMessageType = 'warn | error | success';

/**
 * @group Modules
 */
export interface GlobalMessage {
  title: I18nString;
  message: I18nString;
  colorMode: ColorScheme;
  linkInternal?: LinkInternal;
  type: GlobalMessageType;
  onHomeOnly: boolean;
  validity?: {
    from: Date;
    to: Date;
  };
}
