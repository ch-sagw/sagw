/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, PageProperties, SEO,
} from '../../0_base';
import {
  CtaContactFormSection, FaqSection,
} from '../../3_sections';

/**
 * @group Pages/About
 */
export interface AboutContactPage {
  seo: SEO;
  pageProperties: PageProperties;
  heroTitle: I18nString;
  contactForm: CtaContactFormSection;
  addresses: FaqSection;
}
