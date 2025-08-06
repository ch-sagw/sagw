/* eslint-disable @typescript-eslint/naming-convention */

import {
  ColorMode, I18nString, LinkExternal,
} from '../0_base';
import { Checkbox } from '../1_elements';
import { FormMessage } from '../2_modules/message';
import {
  Person, PersonMemberType,
} from '../6_plc';

/**
 * @group Sections
 */

export interface CtaNewsletterSection {
  title: I18nString;
  text: I18nString;
  buttonText: I18nString;
  stateMessage: FormMessage;
}

/**
 * @group Sections
 */
export interface CtaSubscribeMagazineSection {
  title: I18nString;
  text: I18nString;
  checkboxPdf: Checkbox;
  checkboxPrint: Checkbox;
  buttonText: I18nString;
  stateMessage: FormMessage;
}

/**
 * @group Sections
 */
export interface CtaPromotionSection {
  title: I18nString;
  text: I18nString;
  link: LinkExternal;
  color: ColorMode;
}

/**
 * @group Sections
 */
export interface CtaContactFormSection {
  title: I18nString;
  text: I18nString;
  buttonText: I18nString;
  stateMessage: FormMessage;
  colorMode: ColorMode;
}

/**
 * @group Sections
 * Person can either be Team or Geschäftsleitung
 */
export type AllowedCtaContactMemberType = Exclude<PersonMemberType, 'vorstand'>;

/**
 * Person can either be Team or Geschäftsleitung
 *
 * @group Sections
 */
export interface CtaContactPersonSection {
  color: ColorMode;
  person: Omit<Person, 'memberType'> & { memberType: AllowedCtaContactMemberType }[];
}

/**
 * @group Sections
 */
export interface CtaOrderPublicationFormSection {
  title: I18nString;
  text: I18nString;
  organisation: I18nString;
  street: I18nString;
  zipAndCity: I18nString;
  buttonText: I18nString;
  stateMessage: FormMessage;
}
