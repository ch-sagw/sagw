/* eslint-disable @typescript-eslint/naming-convention */

import {
  ConsentBanner,
  ConsentOverlay,
  Footer, Header,
} from '../2_modules';

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
  }
}
