/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString,
  Rte,
} from '../0_base';

export interface AccordionItem {
  title: I18nString;
  text: Rte;
}

export interface Accordion {
  items: AccordionItem[];
}
