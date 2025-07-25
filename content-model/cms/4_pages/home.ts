/* eslint-disable @typescript-eslint/naming-convention */

import { Footer } from '../2_modules/footer';
import { Navigation } from '../2_modules/navigation';
import { CtaNewsletterSection } from '../3_sections/cta';
import { HeroSection } from '../3_sections/hero';
import { HomeSection } from '../3_sections/home';
import { NewsSection } from '../3_sections/news';

export interface Home {
  navigation: Navigation;
  hero: HeroSection;
  mainSections: HomeSection[];
  news: NewsSection[];
  newsletter: CtaNewsletterSection;
  footer: Footer
}
