/* eslint-disable @typescript-eslint/naming-convention */

export type Target = '_self' | '_blank';

export interface I18nString {
  [lang: string]: string;
}

// real type will come from payload later
export type PageRef = any;

// real type will come from payload later
export type Rte = any;

export interface LinkInternal {
  title: I18nString;
  target: Target;
  slug: PageRef;
}

export interface LinkExternal {
  title: I18nString;
  target: Target;
  href: string;
}

export interface LinkMail {
  title: I18nString;
  address: string;
}

export interface LinkExternalTextless {
  target: Target;
  href: string;
}

export interface Image {
  // Uploaded file reference
  image: any;

  alt: I18nString;
  description?: I18nString;
  credits?: I18nString;
}

export interface Video {
  // Uploaded file reference
  video: any;

  alt: I18nString;
  description?: I18nString;
  credits?: I18nString;
}

export interface Logo {
  // Uploaded file reference
  svg: any;

  alt: I18nString;
}

export interface Document {
  // Uploaded file reference

  document: any;
  title: I18nString;
  date: Date;
}

export interface UIIcon {
  // TODO: tbd
  type: 'hamburger' | 'arrow'
}

export interface DecorativeIcon {
  // TODO: tbd
  type: 'promotion' | 'network' | 'activities' | 'broken-heart'
}

export interface Contact {
  title: I18nString;
  address1?: string;
  address2: string;
  poBox?: I18nString;
  countryCode: string;
  zipCode: number;
  city: string;
  phone: string;
  mail: string;
}

export interface SubNavItem {
  text: I18nString;
  slug: PageRef;
}

export interface MainNavItem {
  text: I18nString;
  children?: SubNavItem[];
  slug?: PageRef;
}

export interface SocialLink {
  type: 'linkedin' | 'facebook' | 'x';
  link: string;
}

export interface Author {
  name: string;
}

export type colorMode = 'bright' | 'dark';
