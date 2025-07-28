/* eslint-disable @typescript-eslint/naming-convention */

import { I18nString } from '../0_base';

/**
 * @group Elements
 */
export interface Checkbox {
  text: I18nString;
  value: string;

  /**
   * Inverted is used on dark backgrounds.
   * Default: false;
   */
  inverted?: boolean;
}
