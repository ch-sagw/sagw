/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, LinkExternalTextless,
} from '../0_base';

/**
 * @group Sections
 */
export interface LinkItem {
  title: I18nString;
  text: I18nString;
  link: LinkExternalTextless;

  // TODO: use GlobalProperties.projectTopic
  project: any;
}

/**
 * @group Sections
 */
export interface LinkSection {
  title: I18nString;
  items: LinkItem[];
}
