/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, Image,
} from '../0_base';

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
