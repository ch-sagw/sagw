/* eslint-disable @typescript-eslint/naming-convention */

import { MagazineSection } from 'content-model/cms/3_sections';
import { HeroSectionReducedColorBright } from '../../../3_sections/hero';

/**
 * @group Pages/Magazine
 */
export interface MagazineOverviewPage {
  hero: HeroSectionReducedColorBright;
  sectionMagazine: MagazineSection;
}
