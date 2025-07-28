/* eslint-disable @typescript-eslint/naming-convention */

import {
  TeaserImageTitleLink,
  TextBlockColor,
} from '../../2_modules';
import {
  CtaContactPersonSection, CtaPromotionSection, DownloadSection,
  FaqSectionColor,
} from '../../3_sections';
import { HeroSectionReducedWhite } from '../../3_sections/hero';

/**
 * @group Pages/Promotion
 */
export interface EarlyCareerAwardPage {
  hero: HeroSectionReducedWhite;
  textBlocksBeforeTeasers: TextBlockColor[];
  teasers: TeaserImageTitleLink;
  textBlocksAfterTeasers: TextBlockColor[];
  downloads: DownloadSection;
  ctaPromotion: CtaPromotionSection;
  faq: FaqSectionColor;
  ctaContact: CtaContactPersonSection;
}
