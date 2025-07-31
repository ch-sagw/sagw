/* eslint-disable @typescript-eslint/naming-convention */

import {
  ColorMode, I18nString, LinkInternal,
  LinkMail,
  LinkPhone,
} from '../0_base';
import { Input } from '../1_elements/input';
import { Checkbox } from '../1_elements/checkbox';
import { FormMessage } from '../2_modules/message';

/**
 * @group Sections
 */

export interface CtaNewsletterSection {
  title: I18nString;
  text: I18nString;
  name: Input;
  email: Input;
  checkbox: Checkbox;
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
  name: Input;
  email: Input;
  checkbox: Checkbox;
  buttonText: I18nString;
  stateMessage: FormMessage;
}

/**
 * @group Sections
 */
export interface CtaPromotionSection {
  title: I18nString;
  text: I18nString;
  link: LinkInternal;
  color: ColorMode;
}

/**
 * @group Sections
 */
export interface CtaContactFormSection {
  title: I18nString;
  text: I18nString;
  name: Input;
  email: Input;

  // TODO
  // Design Flaw: this should be a textifeld
  message: Input;

  checkbox: Checkbox;
  buttonText: I18nString;
  stateMessage: FormMessage;
  colorMode: ColorMode;
}

/**
 * @group Sections
 */
export interface CtaContactPersonSection {
  // TODO
  // we could use Person interface here?
  name: string;
  text: I18nString;
  phone: LinkPhone;
  email: LinkMail;
  color: ColorMode;
}

/**
 * @group Sections
 */
export interface CtaOrderPublicationFormSection {
  title: I18nString;
  text: I18nString;
  name: Input;
  organisation: I18nString;
  street: I18nString;
  zipAndCity: I18nString;
  checkbox: Checkbox;
  buttonText: I18nString;
  stateMessage: FormMessage;
}
