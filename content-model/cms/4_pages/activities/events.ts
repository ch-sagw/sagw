/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, LinkExternal,
  SEO,
} from '../../0_base';

export interface Event {
  category: I18nString;
  title: I18nString;
  text: I18nString;
  link: LinkExternal;
  date: Date;
}

/**
 * Auto-generated. Shows:
 * - all available events
 *
 * @group Pages/Activities
 */
export interface EventsPage {
  seo: SEO;
  heroTitle: I18nString;
  eventsTitle: I18nString;
  events: Event[];
}
