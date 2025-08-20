/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, LinkInternal,
  PageProperties,
  SEO,
} from '../../0_base';
import {
  CtaNewsletterSection, SubpageSection,
} from '../../3_sections';

/**
 * Auto-generated. Shows:
 * - 3 latest magazine articles teasers
 * - 4 latest publications teasers
 * - 3 latest events teasers
 * - 3 latest news articles teasers
 *
 * @group Pages/Activities
 */
export interface ActivitiesPage {
  seo: SEO;
  pageProperties: PageProperties;
  heroTitle: I18nString;
  sectionProjects: SubpageSection;
  sectionMagazine: {
    title: I18nString;
    lead: I18nString;
    allArticlesLink: LinkInternal;
  };
  sectionPublications: {
    title: I18nString;
    lead: I18nString;
    allPublicationsLink: LinkInternal;
  };
  sectionEvents: {
    title: I18nString;
    allEventsLink: LinkInternal;
  };
  sectionNews: {
    title: I18nString;
    allNewsLink: LinkInternal;
  };
  newsletter: CtaNewsletterSection;
}
