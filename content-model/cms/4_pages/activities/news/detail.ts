/* eslint-disable @typescript-eslint/naming-convention */

import { TextBlock } from 'content-model/cms/2_modules';
import { HeroSectionReducedWhite } from '../../../3_sections/hero';
import {
  CtaSubscribeSection,
  LinkSection,
  NewsSection,
} from 'content-model/cms/3_sections';

/**
 * @group Pages/News
 */
export interface NewsDetailPage {
  hero: HeroSectionReducedWhite;
  content: TextBlock[];
  links: LinkSection;
  subscribe: CtaSubscribeSection;
  otherNews: NewsSection;
}
