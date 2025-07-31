/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString,
  RteConfig2,
} from '../0_base';

/**
 * @group Elements
 */

export interface AccordionItem {
  title: I18nString;
  text: RteConfig2;
}

/**
 * @group Elements
 */

export interface Accordion {
  items: AccordionItem[];
}
