/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, PageProperties, SEO,
} from '../../../0_base';
import { CtaNewsletterSection } from '../../../3_sections';

/**
 * Auto-generated. Shows:
 * - available news posts
 *
 * @group Pages/Activities
 */
export interface NewsOverviewPage {
  seo: SEO;
  pageProperties: PageProperties;
  heroTitle: I18nString;
  sectionTitle: I18nString;
  subscribe: CtaNewsletterSection;
  newsDetail: {
    linksTitle: I18nString;
    downloadsTitle: I18nString;
    otherNewsTitle: I18nString;
  }
}
