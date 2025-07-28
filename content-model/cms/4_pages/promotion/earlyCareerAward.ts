/* eslint-disable @typescript-eslint/naming-convention */

import {
  ColorMode, I18nString,
  PageRef,
  SEO,
} from '../../0_base';
import { TextBlockColor } from '../../2_modules';
import {
  CtaContactPersonSection, CtaPromotionSection, DownloadSection,
  FaqSectionColor,
} from '../../3_sections';

/**
 * @group Pages/Promotion
 */
export interface EarlyCareerAwardPage {
  seo: SEO;
  heroTitle: I18nString;
  heroColorMode: ColorMode;
  textBlocksBeforeTeasers: TextBlockColor[];

  winnersTeasers: {
    buttonText: I18nString;
    colorMode: ColorMode;
    items: PageRef[];
  }

  textBlocksAfterTeasers: TextBlockColor[];
  downloads: DownloadSection;
  ctaPromotion: CtaPromotionSection;
  faq: FaqSectionColor;
  ctaContact: CtaContactPersonSection;
}
