/* eslint-disable @typescript-eslint/naming-convention */
import {
  Document, I18nString, LinkInternal,
} from '../0_base';

export interface Download {
  title: I18nString;
  text: I18nString;
  document: Document;
}

export interface DownloadSection {
  title: I18nString;
  text: I18nString;
  items: Download[];
  allDownloadsLink: LinkInternal;
}
