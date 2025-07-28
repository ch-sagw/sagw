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

  /**
   * If false, outline button will be shown.
   * Default: false;
   */
  filled?: boolean;

  // TODO: neccessary, or do we derivate this from the parent element?

  /**
   * Inverted is used on dark backgrounds.
   * Default: false;
   */
  inverted?: boolean;
}
