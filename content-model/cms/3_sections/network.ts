/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, LinkExternalTextless, Logo,
} from '../0_base';

/**
 * @group Sections
 */
export interface NetworkBlock {
  title: I18nString;
  image: Logo;
  link: LinkExternalTextless;
  foundingYear: number;
  category: I18nString;
}

/**
 * @group Sections
 */
export interface NetworkSection {
  filter: {
    title: I18nString;
    allCheckbox: I18nString;
  },
  blocks: {
    items: NetworkBlock[];
    foundingYearText: I18nString;
    linkText: I18nString;
  }
}
