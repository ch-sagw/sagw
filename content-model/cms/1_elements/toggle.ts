/* eslint-disable @typescript-eslint/naming-convention */

import { I18nString } from '../0_base';

/**
 * @group Elements
 */
export interface Toggle {
  labelOn: I18nString;
  labelOff: I18nString;
  value: boolean;
}
