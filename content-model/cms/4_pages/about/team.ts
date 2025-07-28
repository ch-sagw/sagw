/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, SEO,
} from '../../0_base';
import { TeaserPerson } from '../../2_modules';

/**
 * @group Pages/About
 */
export interface AboutTeamPage {
  seo: SEO;
  hero: {
    title: I18nString;
    lead: I18nString;
  }
  items: TeaserPerson[];
}
