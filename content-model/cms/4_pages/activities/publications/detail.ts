/* eslint-disable @typescript-eslint/naming-convention */

import { TextBlock } from 'content-model/cms/2_modules';
import { HeroSectionReducedWhite } from '../../../3_sections/hero';
import {
  CtaOrderFormSection,
  DownloadSection,
  PublicationSection,
} from 'content-model/cms/3_sections';

/**
 * @group Pages/Publications
 */
export interface PublicationsDetailPage {
  hero: HeroSectionReducedWhite;
  content: TextBlock[];
  download: DownloadSection;
  order: CtaOrderFormSection;
  otherPublications: PublicationSection;
}
