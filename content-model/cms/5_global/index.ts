/* eslint-disable @typescript-eslint/naming-convention */

import { ConsentBanner } from '../2_modules/consentBanner';
import { ConsentOverlay } from '../2_modules/consentOverlay';
import { Footer } from '../2_modules/footer';
import { Navigation } from '../2_modules/navigation';

/**
 * @group Global
 */
export interface GlobalProperties {
  consent: ConsentBanner;
  consentOverlay: ConsentOverlay;
  footer: Footer;
  navigation: Navigation;
}
