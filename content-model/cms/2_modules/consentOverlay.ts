/* eslint-disable @typescript-eslint/naming-convention */

import { I18nString } from '../0_base';
import { Toggle } from '../1_elements/toggle';

/**
 * @group Modules
 */
export interface ConsentOverlaySection {
  title: I18nString;
  text: any;
  toggle: Toggle | I18nString;
}

/**
 * @group Modules
 */
export interface ConsentOverlay {
  title: I18nString;
  text: any;
  sectionNecessary: ConsentOverlaySection;
  sectionAnalyticsPerformance: ConsentOverlaySection;
  sectionExternalContent: ConsentOverlaySection;
  buttonAcceptSelection: I18nString;
  buttonAcceptAll: I18nString;
}
