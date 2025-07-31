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

  // TODO: use GlobalProperties.projectTopic
  project: any;
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
