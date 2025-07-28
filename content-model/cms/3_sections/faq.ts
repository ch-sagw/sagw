/* eslint-disable @typescript-eslint/naming-convention */

import {
  ColorMode, I18nString,
} from '../0_base';
import { Accordion } from '../1_elements/accordion';

/**
 * @group Sections
 */
export interface FaqSection {
  title: I18nString;
  items: Accordion[];
}

/**
 * @group Sections
 * Example usage:
 * - early career award
 */
export interface FaqSectionColor {
  title: I18nString;
  items: Accordion[];
  color: ColorMode;
}
