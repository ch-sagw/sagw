import {
  I18nString, LinkExternalTextless, Logo,
} from '../0_base';

/**
 * @group Sections
 */
export interface InstituteBlock {
  title: I18nString;
  text: I18nString;
  image: Logo;
  link: LinkExternalTextless;
}

/**
 * @group Sections
 */
export interface InstituteSection {
  blocks: {
    items: InstituteBlock[];
    linkText: I18nString;
  }
}
