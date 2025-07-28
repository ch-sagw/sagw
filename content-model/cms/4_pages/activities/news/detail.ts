/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, Image, SEO, Video,
} from '../../../0_base';
import { TextBlock } from '../../../2_modules';
import {
  DownloadItem,
  LinkItem,
} from '../../../3_sections';

/**
 * @group Pages/Activities
 */
export interface NewsDetailPage {
  seo: SEO;
  heroTitle: I18nString;
  teaserText: I18nString;
  content: (Image | Video | TextBlock)[];
  links: LinkItem[];
  downloads: DownloadItem[];
}
