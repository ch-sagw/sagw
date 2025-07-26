/* eslint-disable @typescript-eslint/naming-convention */

import { I18nString } from '../0_base';

/**
 * @group Modules
 */

export interface FilterItem {
  text: I18nString;
  id: string;
}

/**
 * @group Modules
 */

export interface Filter {
  title: I18nString;
  items: FilterItem[];
}
