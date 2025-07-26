/* eslint-disable @typescript-eslint/naming-convention */

import { ConsentBanner } from '../2_modules/consentBanner';
import { ConsentOverlay } from '../2_modules/consentOverlay';

/**
 * @group Global
 */
export interface GlobalProperties {
  consent: ConsentBanner;
  consentOverlay: ConsentOverlay;
}
