/* eslint-disable @typescript-eslint/naming-convention */

import { I18nString } from '../0_base';
import { Accordion } from '../1_elements/accordion';

export interface FaqSection {
  title: I18nString;
  items: Accordion[];
}
