/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, PageProperties, SEO,
} from '../../../0_base';
import { TextBlock } from '../../../2_modules';
import { DownloadItem } from '../../../3_sections';

/**
 * @group Pages/Activities
 */
export interface PublicationsDetailPage {
  seo: SEO;
  pageProperties: PageProperties;
  heroTitle: I18nString
  content: TextBlock[];
  downloads: DownloadItem[];
  publicationTopic: I18nString;
  publicationType: I18nString;
  projectId: string;
}
