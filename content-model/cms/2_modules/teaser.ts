/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, Image, LinkExternal, LinkInternal, Logo,
} from '../0_base';

/**
 * @group Modules
 */
export interface CategoryPublication { title: I18nString; }

/**
 * @group Modules
 */
export interface CategoryEvent { title: I18nString; }

/**
 * @group Modules
 */
export interface CategoryNews { title: I18nString; }

/**
 * @group Modules
 */
export interface TeaserGeneric {
  title: I18nString;
  text: I18nString;
  date: Date;
  image: Image;
  linkInternal: LinkInternal;
  category?: CategoryPublication;
}

/**
 * @group Modules
 */
export interface TeaserPerson {
  title: I18nString;
  description: I18nString;
  phone: string;
  mail: string;
  image: Image;
}

/**
 * @group Modules
 */
export interface TeaserLogo {
  title: I18nString;
  foundingYear: number;
  image: Logo;
  linkExternal: LinkExternal;
}

/**
 * @group Modules
 */
export interface TeaserPublication {
  title: I18nString;
  date: Date;
  linkInternal: LinkInternal;
  category: CategoryPublication;
  image: Image;
}

/**
 * @group Modules
 */
export interface TeaserEvent {
  title: I18nString;
  description: I18nString;
  date: Date;
  linkExternal: LinkExternal;
  category: CategoryEvent;
}

/**
 * @group Modules
 */
export interface TeaserNews {
  title: I18nString;
  description: I18nString;
  date: Date;
  linkInternal: LinkInternal;
  category: CategoryNews;
}

/**
 * @group Modules
 */
export interface TeaserDownload {
  document: Document;
}

/**
 * @group Modules
 */
export interface TeaserLink {
  title: I18nString;
  description: I18nString;
  link: LinkInternal | LinkExternal;
}
