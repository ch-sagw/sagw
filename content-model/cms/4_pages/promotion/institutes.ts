
import {
  ColorMode, I18nString,
  SEO,
} from '../../0_base';
import { InstituteSection } from '../../3_sections';

/**
 * @group Pages/Promotion
 */
export interface InstitutesPage {
  seo: SEO;
  heroTitle: I18nString;
  heroColorMode: ColorMode;
  section: InstituteSection;
}
