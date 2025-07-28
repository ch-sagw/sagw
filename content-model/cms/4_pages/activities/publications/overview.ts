/* eslint-disable @typescript-eslint/naming-convention */

import { PublicationSection } from 'content-model/cms/3_sections';
import { HeroSectionReducedColorBright } from '../../../3_sections/hero';

/**
 * @group Pages/Publications
 */
export interface PublicationsOverviewPage {
  hero: HeroSectionReducedColorBright;
  section: PublicationSection;
}
