/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, LinkInternal,
} from '../0_base';

export interface SubpageSectionBlock {
  title: I18nString;
  text: I18nString;
  link: LinkInternal;
}

export interface SubpageSection {
  title: I18nString;
  lead: I18nString;
  blocks: SubpageSectionBlock[];
}
