/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, UIIcon,
} from '../0_base';

export interface Button {
  text: I18nString;
  iconBefore?: UIIcon;
  iconAfter?: UIIcon;
}
