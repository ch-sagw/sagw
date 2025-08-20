/* eslint-disable @typescript-eslint/naming-convention */

import {
  Document, I18nString, PageProperties, SEO,
} from '../../../0_base';
import { TextBlock } from '../../../2_modules';

/**
 * @group Pages/Activities
 */
export interface PublicationsDetailPage {
  seo: SEO;
  pageProperties: PageProperties;
  heroTitle: I18nString
  content: TextBlock[];
  downloads: Document[];
  publicationTopic: I18nString;
  publicationType: I18nString;
  projectId: string;
}
