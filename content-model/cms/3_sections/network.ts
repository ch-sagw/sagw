/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, LinkExternalTextless, Logo,
} from '../0_base';
import { Filter } from '../2_modules/filter';

export interface NetworkBlock {
  title: I18nString;
  image: Logo;
  link: LinkExternalTextless;
  foundingYear: number;
}

export interface NetworkSection {
  title: I18nString;
  filter: Filter;
  blocks: {
    items: NetworkBlock[];
    foundingYearText: I18nString;
    linkText: I18nString;
  }
}
