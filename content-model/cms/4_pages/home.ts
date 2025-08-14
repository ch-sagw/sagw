/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, LinkInternal,
  PageProperties,
  SEO,
} from '../0_base';

/**
 * @group Pages
 */
export interface HomePage {
  seo: SEO;
  pageProperties: PageProperties
  ;
  hero: {
    sideTitle: I18nString;
    title: I18nString;
    lead?: I18nString;
    link: LinkInternal;
  }
}
