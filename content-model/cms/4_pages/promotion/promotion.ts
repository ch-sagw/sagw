/* eslint-disable @typescript-eslint/naming-convention */

import {
  CtaContactFormSection, FaqSection, SubpageSection,
} from '../../3_sections';
import { HeroSectionReducedColorBright } from '../../3_sections/hero';

/**
 * @group Pages/Promotion
 */
export interface PromotionPage {
  hero: HeroSectionReducedColorBright;
  sections: SubpageSection[];
  faq: FaqSection;
  contact: CtaContactFormSection;
}
