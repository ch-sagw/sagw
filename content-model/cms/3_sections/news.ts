/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, LinkInternal,
} from '../0_base';

export interface News {
  title: I18nString;
  text: I18nString;
  date: Date;
  link: LinkInternal;
}

export interface NewsSection {
  title: I18nString;
  items: News[];
  allNewsLink: LinkInternal;
}
