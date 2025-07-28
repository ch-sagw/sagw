import { I18nString } from '../0_base';

/**
 * @group Elements
 */
export interface Input {
  placeholder: I18nString;
  label: I18nString;
  error: I18nString;

  // TODO: neccessary, or do we derivate this from the parent element?

  /**
   * Inverted is used on dark backgrounds.
   * Default: false;
   */
  inverted?: boolean;
}
