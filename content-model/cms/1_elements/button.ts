/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, UIIcon,
} from '../0_base';

/**
 * @group Elements
 */

export interface Button {
  text: I18nString;
  iconBefore?: UIIcon;
  iconAfter?: UIIcon;
}
