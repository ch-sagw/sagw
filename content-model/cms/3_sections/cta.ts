/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, LinkInternal, LinkMail,
} from '../0_base';
import { Input } from '../1_elements/input';
import { Checkbox } from '../1_elements/checkbox';
import { Message } from '../2_modules/message';

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

export interface CtaPromotionSection {
  title: I18nString;
  text: I18nString;
  link: LinkInternal;
}

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

export interface CtaContactPerson {
  name: string;
  text: I18nString;
  phone: string;
  email: LinkMail;
}

export interface CtaContactPersonSection {
  title: I18nString;
  text: I18nString;
  items: CtaContactPerson[];
}

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
