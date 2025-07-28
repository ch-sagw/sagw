/* eslint-disable @typescript-eslint/naming-convention */
import {
  ColorMode,
  Document, I18nString, LinkInternal,
} from '../0_base';

/**
 * @group Sections
 */
export interface Download {
  title: I18nString;
  text: I18nString;
  document: Document;
}

/**
 * @group Sections
 */
export interface DownloadSection {
  title: I18nString;
  text: I18nString;
  items: Download[];
  allDownloadsLink: LinkInternal;
  colorMode: ColorMode;
}
