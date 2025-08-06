
import {
  ColorMode, I18nString,
  LinkExternalTextless,
  LinkInternalTextless,
  Logo,
  PageProperties,
  SEO,
} from '../../0_base';

/**
 * @group Pages/Promotion
 */
export interface InstituteDetailPage {
  pageProperties: PageProperties;
  seo: SEO;
  heroTitle: I18nString;
  heroColorMode: ColorMode;
  institute: {
    title: I18nString;
    text: I18nString;
    image: Logo;
    link: LinkExternalTextless | LinkInternalTextless;
  }
}
