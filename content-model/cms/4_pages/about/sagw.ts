/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, Image, PageProperties, SEO, Video,
} from '../../0_base';
import { TextBlock } from '../../2_modules';
import {
  DownloadSection, LinkSection,
} from '../../3_sections';

/**
 * @group Pages/About
 */
export interface AboutSagwPage {
  seo: SEO;
  pageProperties: PageProperties;
  hero: {
    title: I18nString;
    lead: I18nString;
  }
  content: (Image | Video | TextBlock)[];
  links?: LinkSection;
  downloads?: DownloadSection;
}
