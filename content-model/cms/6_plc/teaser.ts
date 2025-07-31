/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, Image,
  LinkPhone,
} from '../0_base';

export type TeaserPersonMember = 'vorstand' | 'geschaeftsleitung' | 'team';

/**
 * Placeless content: managed in one place, can be used everywhere
 *
 * @group PLC
 */
export interface TeaserPerson {
  namePrefix?: I18nString;
  firstname: string;
  lastname: string;
  middlename?: string;
  function: I18nString;
  phone: LinkPhone;
  mail: string;
  image: Image;
  memberType: TeaserPersonMember;
}
