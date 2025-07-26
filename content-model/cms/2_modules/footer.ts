/* eslint-disable @typescript-eslint/naming-convention */

import {
  Contact, I18nString, MainNavItem, SocialLink, SubNavItem,
} from '../0_base';

/**
 * @group Modules
 */

export interface Footer {
  title: I18nString;
  contact?: Contact;
  navigation: MainNavItem[];
  metaNavigation: SubNavItem[];
  copyright: I18nString;
  socialLinks: SocialLink[];
}
