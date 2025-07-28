/* eslint-disable @typescript-eslint/naming-convention */

import { NetworkSection } from '../3_sections';
import { HeroSectionReducedColorBright } from '../3_sections/hero';

/**
 * @group Pages
 */
export interface NetworkPage {
  hero: HeroSectionReducedColorBright;
  section: NetworkSection;
}
