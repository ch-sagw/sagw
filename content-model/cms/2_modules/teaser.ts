/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, Image, LinkExternal, LinkInternal, Logo,
} from '../0_base';

export interface CategoryPublication { title: I18nString; }
export interface CategoryEvent { title: I18nString; }
export interface CategoryNews { title: I18nString; }

export interface TeaserGeneric {
  title: I18nString;
  text: I18nString;
  date: Date;
  image: Image;
  linkInternal: LinkInternal;
  category?: CategoryPublication;
}

export interface TeaserPerson {
  title: I18nString;
  description: I18nString;
  phone: string;
  mail: string;
  image: Image;
}

export interface TeaserLogo {
  title: I18nString;
  foundingYear: number;
  image: Logo;
  linkExternal: LinkExternal;
}

export interface TeaserPublication {
  title: I18nString;
  date: Date;
  linkInternal: LinkInternal;
  category: CategoryPublication;
  image: Image;
}

export interface TeaserEvent {
  title: I18nString;
  description: I18nString;
  date: Date;
  linkExternal: LinkExternal;
  category: CategoryEvent;
}

export interface TeaserNews {
  title: I18nString;
  description: I18nString;
  date: Date;
  linkInternal: LinkInternal;
  category: CategoryNews;
}

export interface TeaserDownload {
  document: Document;
}

export interface TeaserLink {
  title: I18nString;
  description: I18nString;
  link: LinkInternal | LinkExternal;
}
