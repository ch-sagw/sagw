/* eslint-disable @typescript-eslint/naming-convention */

import { TextBlock } from 'content-model/cms/2_modules';
import { HeroSectionArticle } from '../../../3_sections/hero';
import { Image } from 'content-model/cms/0_base';
import {
  CtaSubscribeSection, DownloadSection,
} from 'content-model/cms/3_sections';

/**
 * @group Pages/Magazine
 */
export interface MagazineDetailPage {
  hero: HeroSectionArticle;
  content: (Image | TextBlock)[];
  download: DownloadSection;
  subscribe: CtaSubscribeSection;
}
