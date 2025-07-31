/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, RteConfig1,
} from '../0_base';

/**
 * @group Modules
 */
export interface ConsentBanner {
  title: I18nString;
  text: RteConfig1;
  buttonAcceptAll: I18nString;
  buttonDeclineAll: I18nString;
  buttonCustomizeSelection: I18nString;
}
