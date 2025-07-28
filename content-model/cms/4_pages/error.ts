/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, LinkInternal,
} from '../0_base';

/**
 * @group Pages
 */
export interface ErrorPage {
  heroTitle: I18nString;
  errorCode: number;
  text: I18nString;
  link: LinkInternal;
}
