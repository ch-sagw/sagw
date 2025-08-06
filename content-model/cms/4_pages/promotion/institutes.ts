
import {
  ColorMode, I18nString,
  PageProperties,
  SEO,
} from '../../0_base';

/**
 * @group Pages/Promotion
 */
export interface InstitutesPage {
  pageProperties: PageProperties;
  seo: SEO;
  heroTitle: I18nString;
  heroColorMode: ColorMode;
  teaserLinkText: I18nString;
}
