/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, LinkInternal,
  SEO,
} from '../0_base';

/**
 * @group Pages
 */
export interface HomePage {
  seo: SEO;
  hero: {
    sideTitle: I18nString;
    title: I18nString;
    text: I18nString;
    lead?: I18nString;
    link: LinkInternal;
  }
}
