/* eslint-disable @typescript-eslint/naming-convention */
import {
  ColorMode,
  Document, I18nString, LinkInternal,
} from '../0_base';

/**
 * @group Sections
 */
export interface DownloadItem {
  title: I18nString;
  text: I18nString;
  document: Document;
  projectId: string;
}

/**
 * @group Sections
 */
export interface DownloadSection {
  title: I18nString;
  text?: I18nString;
  items: DownloadItem[];
  allDownloadsLink?: LinkInternal;
  colorMode: ColorMode;
}
