/* eslint-disable @typescript-eslint/naming-convention */

import { ConsentBanner } from '../2_modules/consentBanner';
import { ConsentOverlay } from '../2_modules/consentOverlay';
import { Footer } from '../2_modules/footer';
import { Header } from '../2_modules/header';

/**
 * @group Global
 */
export interface GlobalProperties {
  header: Header;
  footer: Footer;
  consent: ConsentBanner;
  consentOverlay: ConsentOverlay;
}
