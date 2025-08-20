/* eslint-disable @typescript-eslint/naming-convention */

import {
  Document, I18nString, Image, PageProperties, SEO, Video,
} from '../../../0_base';
import { TextBlock } from '../../../2_modules';
import { LinkItem } from '../../../3_sections';

/**
 * @group Pages/Activities
 */
export interface NewsDetailPage {
  seo: SEO;
  pageProperties: PageProperties;
  heroTitle: I18nString;
  teaserText: I18nString;
  content: (Image | Video | TextBlock)[];
  links: LinkItem[];
  downloads: Document[];
  date: Date;
}
