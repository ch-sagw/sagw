/* eslint-disable @typescript-eslint/naming-convention */

/**
 * @group Base
 */
export type Target = '_self' | '_blank';

/**
 * @group Base
 */
export interface I18nString {
  [lang: string]: string;
}

/**
 * @group Base
 */
// real type will come from payload later
export type PageRef = any;

/**
 * @group Base
 */
// real type will come from payload later
export type Rte = any;

/**
 * @group Base
 */
export interface LinkInternal {
  title: I18nString;
  target: Target;
  slug: PageRef;
}

/**
 * @group Base
 */
export interface LinkExternal {
  title: I18nString;
  target: Target;
  href: string;
}

/**
 * @group Base
 */
export interface LinkMail {
  title: I18nString;
  address: string;
}

/**
 * @group Base
 */
export interface LinkExternalTextless {
  target: Target;
  href: string;
}

/**
 * @group Base
 */
export interface Image {
  // Uploaded file reference
  image: any;

  alt: I18nString;
  description?: I18nString;
  credits?: I18nString;
}

/**
 * @group Base
 */
export interface Video {
  // Uploaded file reference
  video: any;

  alt: I18nString;
  description?: I18nString;
  credits?: I18nString;
}

/**
 * @group Base
 */
export interface Logo {
  // Uploaded file reference
  svg: any;

  alt: I18nString;
}

/**
 * @group Base
 */
export interface Document {

  /**
   * Uploaded file reference
   */
  document: any;

  title: I18nString;
  date: Date;
}

/**
 * @group Base
 */
export interface UIIcon {
  // TODO: tbd
  type: 'hamburger' | 'arrow'
}

/**
 * @group Base
 */
export interface DecorativeIcon {
  // TODO: tbd
  type: 'promotion' | 'network' | 'activities' | 'broken-heart'
}

/**
 * @group Base
 */
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

/**
 * @group Base
 */
export interface SocialLink {
  type: 'linkedin' | 'facebook' | 'x';
  link: string;
}

/**
 * @group Base
 */
export interface Author {
  name: string;
}

/**
 * @group Base
 */
export type ColorScheme = 'bright' | 'dark';

/**
 * @group Base
 */
export type ColorModeReduced = 'white' | 'color';

/**
 * @group Base
 */
export type ColorMode =
  | { colorMode: 'white' }
  | { colorMode: 'color'; colorScheme: ColorScheme };

/**
 * @group Base
 */
export interface SubNavItem {
  text: I18nString;
  slug: PageRef;
}

/**
 * @group Base
 */
export interface MainNavItem {
  text: I18nString;
  children?: SubNavItem[];
  slug?: PageRef;
}
