/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, LinkExternalTextless,
} from '../0_base';

export interface LinkItem {
  title: I18nString;
  text: I18nString;
  link: LinkExternalTextless;
}

export interface LinkSection {
  title: I18nString;
  items: LinkItem[];
}
