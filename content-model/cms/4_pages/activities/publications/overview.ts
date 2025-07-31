/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, PageProperties, SEO,
} from '../../../0_base';
import { CtaOrderPublicationFormSection } from '../../../3_sections';

/**
 * Auto-generated. Shows:
 * - all available publications as teaser
 *
 * @group Pages/Activities
 */
export interface PublicationsOverviewPage {
  seo: SEO;
  pageProperties: PageProperties;
  heroTitle: I18nString;
  filters: {
    title: I18nString;
    allCheckboxTopics: I18nString;
    allCheckboxTypes: I18nString;
  },
  publicationDetail: {
    downloadsTitle: I18nString,
    order: CtaOrderPublicationFormSection;
    otherPublications: {
      title: I18nString;
      allPublicationsButton: I18nString;
    }
  }
}
