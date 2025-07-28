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
 * Example usage:
 * - early career award
 *
 * @group Sections
 */
export interface FaqSectionColor extends FaqSection {
  colorMode: ColorMode;
}
