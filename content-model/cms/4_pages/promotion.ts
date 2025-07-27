/* eslint-disable @typescript-eslint/naming-convention */

import { CtaNewsletterSection } from '../3_sections/cta';
import { HeroSection } from '../3_sections/hero';
import { HomeSection } from '../3_sections/home';
import { NewsSection } from '../3_sections/news';

/**
 * @group Pages
 */
export interface Home {
  hero: HeroSection;
  mainSections: HomeSection[];
  news: NewsSection[];
  newsletter: CtaNewsletterSection;
}
