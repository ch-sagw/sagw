/* eslint-disable @typescript-eslint/naming-convention */

import {
  ColorScheme, I18nString, LinkInternal,
} from '../0_base';

/**
 * @group Modules
 */
export interface Message {
  title: I18nString;
  messageSuccess: Message;
  colorMode: ColorScheme;
  messageError?: Message;
  messageWarn?: Message;
  linkInternal?: LinkInternal;
}
