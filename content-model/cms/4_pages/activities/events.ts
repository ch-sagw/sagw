/* eslint-disable @typescript-eslint/naming-convention */

import { NewsSection } from 'content-model/cms/3_sections';
import { HeroSectionReducedColorBright } from '../../3_sections/hero';

/**
 * @group Pages
 */
export interface EventsPage {
  hero: HeroSectionReducedColorBright;
  sectionNews: NewsSection;
}
