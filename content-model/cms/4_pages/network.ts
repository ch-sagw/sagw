/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, PageProperties, SEO,
} from '../0_base';
import { NetworkSection } from '../3_sections';

/**
 * @group Pages
 */
export interface NetworkPage {
  seo: SEO;
  pageProperties: PageProperties;
  heroTitle: I18nString;
  section: NetworkSection;
}
