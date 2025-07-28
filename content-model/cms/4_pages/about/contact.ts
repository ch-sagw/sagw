/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, SEO,
} from '../../0_base';
import {
  CtaContactFormSection, FaqSection,
} from '../../3_sections';

/**
 * @group Pages/About
 */
export interface AboutContactPage {
  seo: SEO;
  heroTitle: I18nString;
  contactForm: CtaContactFormSection;
  addresses: FaqSection;
}
