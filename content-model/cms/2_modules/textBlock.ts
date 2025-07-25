/* eslint-disable @typescript-eslint/naming-convention */

import {
  I18nString, Rte,
} from '../0_base';

export interface TextBlock {
  title: I18nString;
  rte: Rte;
  copyButtonText: I18nString;
}
