/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, PageProperties, SEO,
} from '../../0_base';
import {
  CtaContactFormSection, FaqSection, SubpageSection,
} from '../../3_sections';

/**
 * @group Pages/Promotion
 */
export interface PromotionPage {
  seo: SEO;
  pageProperties: PageProperties;
  heroTitle: I18nString;
  content: SubpageSection;
  faq: FaqSection;
  contact: CtaContactFormSection;
}
