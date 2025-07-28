/* eslint-disable @typescript-eslint/naming-convention */

import {
  EventSection,
  MagazineSection, NewsSection, PublicationSection, SubpageSection,
} from 'content-model/cms/3_sections';
import { HeroSectionReducedColorBright } from '../../3_sections/hero';

/**
 * @group Pages
 */
export interface ActivitiesPage {
  hero: HeroSectionReducedColorBright;
  sectionProjects: SubpageSection;
  sectionMagazine: MagazineSection;
  sectionPublications: PublicationSection;
  sectionEvents: EventSection;
  sectionNews: NewsSection;
}
