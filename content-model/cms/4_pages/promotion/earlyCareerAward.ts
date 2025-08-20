/* eslint-disable @typescript-eslint/naming-convention */

import {
  ColorMode, I18nString,
  PageProperties,
  PageRef,
  SEO,
} from '../../0_base';
import { TextBlock } from '../../2_modules';
import {
  CtaContactPersonSection, CtaPromotionSection, DownloadSection,
  FaqSectionColor,
} from '../../3_sections';

/**
 * @group Pages/Promotion
 */
export interface EarlyCareerAwardPage {
  seo: SEO;
  pageProperties: PageProperties;
  heroTitle: I18nString;
  heroColorMode: ColorMode;
  textBlocksBeforeTeasers: TextBlock[];

  winnersTeasers: {
    buttonText: I18nString;
    items: PageRef[];
  }

  textBlocksAfterTeasers: TextBlock[];
  downloads: DownloadSection;
  ctaPromotion: CtaPromotionSection;
  faq: FaqSectionColor;
  ctaContact: CtaContactPersonSection;
}
