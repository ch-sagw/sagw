/* eslint-disable @typescript-eslint/naming-convention */

import { I18nString } from '../0_base';

/**
 * @group Elements
 */
export interface Label {
  text: I18nString;

  // TODO: neccessary, or do we derivate this from the parent element?

  /**
   * Inverted is used on dark backgrounds.
   * Default: false;
   */
  inverted?: boolean;
}
