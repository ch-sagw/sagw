/* eslint-disable @typescript-eslint/naming-convention */

import { RteConfig2 } from '../0_base';

/**
 * @group Elements
 */
export interface Checkbox {
  text: RteConfig2;
  value: string;
  required: boolean;
  checked: boolean;
}
