/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString,
  Rte,
} from '../0_base';

/**
 * @group Elements
 */

export interface AccordionItem {
  title: I18nString;
  text: Rte;
}

/**
 * @group Elements
 */

export interface Accordion {
  items: AccordionItem[];
}
