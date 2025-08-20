/* eslint-disable @typescript-eslint/naming-convention */

import {
  ConsentBanner,
  ConsentOverlay,
  Footer, GlobalMessage, Header,
} from '../2_modules';
import {
  I18nString, RteConfig2, SEO,
} from '../0_base';

/**
 * @group Global
 */
export interface GlobalProperties {
  header: Header;
  footer: Footer;
  consentBanner: ConsentBanner;
  consentOverlay: ConsentOverlay;
  mailRecipients: {
    contactForm: string;
    newsletterForm: string;
    subscribeMagazineForm: string;
    orderPublicationForm: string;
  };
  languages: {
    de: boolean;
    it: boolean;
    fr: boolean;
    en: boolean;
  };
  message: GlobalMessage;
  projectTopics: {
    id: string;
    text: I18nString[];
  };
  seo: SEO;
  i18n: {
    sectionTitles: {
      download: I18nString;
    },
    formValidation: {
      errors: {
        email: I18nString;
      }
    },
    formFields: {
      email: {
        label: I18nString;
        placeholder: I18nString;
      },
      name: {
        label: I18nString;
        placeholder: I18nString;
      },
      message: {
        label: I18nString;
        placeholder: I18nString;
      },
      dataPrivacyCheckbox: {
        text: RteConfig2;
      }
    }
  }
}
