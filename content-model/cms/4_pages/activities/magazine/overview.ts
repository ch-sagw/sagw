/* eslint-disable @typescript-eslint/naming-convention */

import { CtaSubscribeMagazineSection } from '../../../3_sections';
import {
  I18nString, PageProperties, SEO,
} from '../../../0_base';

/**
 * Auto-generated. Shows:
 * - all available magazine articles as teaser
 * - the first image of the magazine article is taken as teaser image
 *
 * @group Pages/Activities
 */
export interface MagazineOverviewPage {
  seo: SEO;
  pageProperties: PageProperties;
  heroTitle: I18nString;
  articleDetail: {
    hero: {
      exportButtonTitle: I18nString;
    },
    downloads: {
      title: I18nString;
      text: I18nString;
    },
    linksTitle: I18nString,
    subscribe: CtaSubscribeMagazineSection;
  }
}
