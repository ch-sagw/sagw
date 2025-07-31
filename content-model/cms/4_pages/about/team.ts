/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, PageProperties, SEO,
} from '../../0_base';
import { Person } from '../../6_plc';

/**
 * @group Pages/About
 */
export interface AboutTeamPage {
  seo: SEO;
  pageProperties: PageProperties;
  hero: {
    title: I18nString;
    lead: I18nString;
  }
  items: Person[];
}
