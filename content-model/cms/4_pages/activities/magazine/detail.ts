/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, Image,
  SEO,
  Video,
} from '../../../0_base';
import { TextBlock } from '../../../2_modules';
import {
  DownloadItem,
  LinkItem,
} from '../../../3_sections';

/**
 * @group Pages/Activities
 */
export interface MagazineDetailPage {
  seo: SEO;
  hero: {
    title: I18nString;
    lead: I18nString;
    author: string;
    date: Date;
  };
  teaserText: I18nString;
  content: (Image | Video | TextBlock)[];
  download?: DownloadItem[];
  links?: LinkItem[];

}
