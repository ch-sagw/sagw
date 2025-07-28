/* eslint-disable @typescript-eslint/naming-convention */

import {
  CtaSubscribeSection, NewsSection,
} from 'content-model/cms/3_sections';
import { HeroSectionReducedColorBright } from '../../../3_sections/hero';

/**
 * @group Pages/News
 */
export interface NewsOverviewPage {
  hero: HeroSectionReducedColorBright;
  sectionNews: NewsSection;
  subscribe: CtaSubscribeSection;
}
