/* eslint-disable @typescript-eslint/naming-convention */

import {
  Document,
  I18nString,
  ImageInline,
  PageProperties,
  SEO,
  Video,
} from '../../../0_base';
import { TextBlock } from '../../../2_modules';

/**
 * @group Pages/Activities
 */
export interface MagazineDetailPage {
  seo: SEO;
  pageProperties: PageProperties;
  hero: {
    title: I18nString;
    lead: I18nString;
    author: string;
    date: Date;
  };
  teaserText: I18nString;
  content: (ImageInline | Video | TextBlock)[];
  download?: Document[];
}
