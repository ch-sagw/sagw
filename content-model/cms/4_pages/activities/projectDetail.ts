/* eslint-disable @typescript-eslint/naming-convention */

// import { GlobalProperties } from '../../5_global/index';
import { CtaContactFormSection } from 'content-model/cms/3_sections';
import {
  I18nString,
  PageProperties,
  RteConfig2,
  SEO,
} from '../../0_base';

/**
 * Auto-generated. Shows:
 * - all available events
 *
 * @group Pages/Activities
 */
export interface ProjectDetailPage {
  seo: SEO;
  pageProperties: PageProperties;
  heroTitle: I18nString;
  lead: I18nString;
  text: RteConfig2;
  projectId: string;
  contact: CtaContactFormSection;
}
