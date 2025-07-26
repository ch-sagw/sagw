/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, Image, LinkInternal,
} from '../0_base';

/**
 * @group Sections
 */
export interface MagazineBlock {
  title: I18nString;
  text: I18nString;
  image: Image;
  link: LinkInternal;
}

/**
 * @group Sections
 */
export interface MagazineSection {
  title: I18nString;
  lead: I18nString;
  allArticlesLink: LinkInternal;
  blocks: MagazineBlock[];
}
