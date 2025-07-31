
import {
  ColorMode, I18nString,
  PageProperties,
  SEO,
} from '../../0_base';
import { InstituteSection } from '../../3_sections';

/**
 * @group Pages/Promotion
 */
export interface InstitutesPage {
  pageProperties: PageProperties;
  seo: SEO;
  heroTitle: I18nString;
  heroColorMode: ColorMode;
  section: InstituteSection;
}
