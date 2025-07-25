/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, Image, LinkExternal, LinkInternal,
} from '../0_base';
import { CategoryPublication } from '../2_modules/teaser';

export interface Publication {
  category: CategoryPublication;
  title: I18nString;
  image: Image;
  link: LinkExternal;
  date: Date;
}

export interface PublicationSection {
  title: I18nString;
  lead: I18nString;
  items: Publication[];
  allPublicationsLink: LinkInternal;
}
