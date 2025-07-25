/* eslint-disable @typescript-eslint/naming-convention */

import {
  colorMode, I18nString, LinkInternal,
} from '../0_base';

export interface Message {
  title: I18nString;
  message: I18nString;
  type: 'success' | 'warning' | 'error';
  colorMode: colorMode;
  linkInternal?: LinkInternal;
}
