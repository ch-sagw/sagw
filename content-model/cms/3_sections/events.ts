/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, LinkExternal, LinkInternal,
} from '../0_base';
import { CategoryEvent } from '../2_modules/teaser';

/**
 * @group Sections
 */
export interface Event {
  category: CategoryEvent;
  title: I18nString;
  text: I18nString;
  link: LinkExternal;
  date: Date;
}

/**
 * @group Sections
 */
export interface EventSection {
  title: I18nString;
  items: Event[];
  allEventsLink: LinkInternal;
}
