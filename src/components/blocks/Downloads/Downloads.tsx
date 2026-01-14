import 'server-only';
import React, { Fragment } from 'react';
import { TeaserLinkList } from '@/components/base/TeaserLinkList/TeaserLinkList';
import {
  DownloadLinkItem, InterfaceDownloadLinkItemPropTypes,
} from '@/components/base/DownloadLinkItem/DownloadLinkItem';
import {
  Document, InterfaceDownloadsBlock,
  ZenodoDocument,
} from '@/payload-types';
import { InterfaceRte } from '@/components/base/types/rte';
import { rteToHtml } from '@/utilities/rteToHtml';

export type InterfaceDownloadsPropTypes = {
  title: InterfaceRte;
} & InterfaceDownloadsBlock;

export const Downloads = (props: InterfaceDownloadsPropTypes): React.JSX.Element => {
  const title = rteToHtml(props.title);

  const returnDocumentItems: InterfaceDownloadLinkItemPropTypes[] = [];

  props.downloads?.forEach((item) => {
    if (item.relationTo === 'documents') {
      const documentItem = item.value as Document;
      const formatSplit = documentItem.filename?.split('.');
      let format = 'none';
      const fileSize = documentItem.filesize
        ? Number((documentItem.filesize / (1024 * 1024)).toFixed(2))
        : 0;
      let fileSizeText = `${fileSize} MB`;

      if (fileSize < 1) {
        fileSizeText = `${Math.round(fileSize * 1024)} KB`;
      }

      if (formatSplit && formatSplit.length > 1) {
        format = formatSplit[formatSplit.length - 1];
      }

      const returnDocument: InterfaceDownloadLinkItemPropTypes = {
        date: documentItem.date || '',
        format: format.toUpperCase(),
        link: {
          href: documentItem.url || '',
          target: '_blank' as const,
        },
        size: fileSizeText,
        title: rteToHtml(documentItem.title),
        type: 'download' as const,
      };

      returnDocumentItems.push(returnDocument);
    } else if (item.relationTo === 'zenodoDocuments') {
      const documentItem = item.value as ZenodoDocument;

      // zenodo documents can have multiple files....
      documentItem.files.forEach((file, index) => {
        let documentTitle = documentItem.title;

        if (documentItem.files.length > 1) {
          documentTitle += ` - ${index + 1} / ${documentItem.files.length}`;
        }

        const fileSize = file.size || 0;
        let fileSizeText = `${fileSize} MB`;

        if (fileSize < 1) {
          fileSizeText = `${Math.round(fileSize * 1024)} KB`;
        }

        const returnDocument: InterfaceDownloadLinkItemPropTypes = {
          date: (new Date(documentItem.publicationDate))
            .toString(),
          format: file.format?.toUpperCase() || '',
          link: {
            href: file.link || 'foo',
            target: '_blank' as const,
          },
          size: fileSizeText,
          title: documentTitle,
          type: 'download' as const,
        };

        returnDocumentItems.push(returnDocument);
      });
    }
  });

  if (returnDocumentItems.length < 1) {
    return <Fragment></Fragment>;
  }

  return (
    <TeaserLinkList
      title={title}
      subtitle={props.subtitle
        ? rteToHtml(props.subtitle)
        : undefined
      }
      colorMode='light'
    >
      {returnDocumentItems.map((item, key) => {
        if (item) {
          return (
            <DownloadLinkItem
              key={key}
              {...item}
            />
          );
        }

        return undefined;
      })}
    </TeaserLinkList>
  );
};
