/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, Rte,
} from '../0_base';

/**
 * @group Modules
 */

export interface ConsentBanner {
  title: I18nString;
  text: Rte;
  buttonAcceptAll: I18nString;
  buttonDeclineAll: I18nString;
  buttonCustomizeSelection: I18nString;
}
