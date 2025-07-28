/* eslint-disable @typescript-eslint/naming-convention */

import {
  ColorMode,
  I18nString, LinkInternal, LinkMail,
} from '../0_base';
import { Input } from '../1_elements/input';
import { Checkbox } from '../1_elements/checkbox';
import { Message } from '../2_modules/message';

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
  messageSuccess: Message;
  messageError?: Message;
  messageWarn?: Message;
  recipientMailAddress: string;
}

/**
 * @group Sections
 */
export interface CtaSubscribeSection {
  title: I18nString;
  text: I18nString;
  checkboxPdf: Checkbox;
  checkboxPrint: Checkbox;
  name: Input;
  email: Input;
  checkbox: Checkbox;
  buttonText: I18nString;
  recipientMailAddress: string;
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

  // Design Flaw: this should be a textifeld
  message: Input;

  checkbox: Checkbox;
  buttonText: I18nString;
  recipientMailAddress: string;
}

/**
 * @group Sections
 */
export interface CtaContactPersonSection {
  name: string;
  text: I18nString;
  phone: string;
  email: LinkMail;
  color: ColorMode;
}

/**
 * @group Sections
 */
export interface CtaOrderFormSection {
  title: I18nString;
  text: I18nString;
  name: Input;
  organisation: I18nString;
  street: I18nString;
  zipAndCity: I18nString;
  checkbox: Checkbox;
  buttonText: I18nString;
  recipientMailAddress: string;
}
