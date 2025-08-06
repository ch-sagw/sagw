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

// real types will come from payload later

/**
 * Rte 1:
 * sub- and superscript
 * &shy;
 *
 * @group Base
 */
export type RteConfig1 = 'rteConfig1';

/**
 * Rte 2: Rte1
 * + bold/italic/underline/strikethrough/uppercase
 * + links
 *
 * @group Base
 */
export type RteConfig2 = 'rteConfig2';

/**
 * @group Base
 */
export interface LinkInternalTextless {
  target: Target;
  slug: PageRef;
}

/**
 * @group Base
 */
export interface LinkInternal extends LinkInternalTextless {
  text: I18nString;
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
export interface LinkExternal extends LinkExternalTextless {
  text: I18nString;
}

// TOODO:
// define title in global i18n

/**
 * @group Base
 */
export interface LinkMail {
  // title: I18nString;
  address: string;
}

/**
 * @group Base
 */
export interface LinkPhone {
  phone: string;
}

/**
 * @group Base
 */
export interface Image {
  // Uploaded file reference
  image: any;

  alt?: I18nString;
  description?: I18nString;
  credits?: I18nString;
  focusPoint?: {
    x: number;
    y: number;
  }
}

/**
 * Example usage: News detail page.
 *
 * @group Base
 */

export interface ImageInline extends Image {
  position: 'full' | 'left' | 'right';
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

  // Uploaded file reference
  image: any;

  title: I18nString;
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
  text?: I18nString;
  projectId?: string;
}

/**
 * @group Base
 */
export interface Contact {
  title?: I18nString;
  address1?: string;
  address2?: string;
  poBox?: I18nString;
  countryCode?: string;
  zipCode?: number;
  city?: string;
  phone?: string;
  mail?: string;
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

/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-empty-interface */
export interface MetaNavItem extends SubNavItem { }
/* eslint-enable @typescript-eslint/no-empty-object-type */
/* eslint-enable @typescript-eslint/no-empty-interface */

/**
 * @group Base
 */
export interface MainNavItem {
  text: I18nString;
  children?: SubNavItem[];
  slug?: PageRef;
}

/**
 * @group Base
 */
export interface SEO {
  description: I18nString;
  title: I18nString;
  og: {
    title: I18nString;
    description: I18nString;

    // Uploaded file reference
    image: any;
  }
}

/**
 * @group Base
 */
export interface PageProperties {
  index: boolean;
}
