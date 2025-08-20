/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, LinkExternal, LinkInternal,
} from '../0_base';

/**
 * @group Sections
 */
export interface SubpageSectionBlock {
  title: I18nString;
  text: I18nString;
  link: LinkInternal | LinkExternal;
}

/**
 * @group Sections
 */
export interface SubpageSection {
  title: I18nString;
  lead: I18nString;
  alignement: 'horizontal' | 'vertical';
  blocks: SubpageSectionBlock[];
}
