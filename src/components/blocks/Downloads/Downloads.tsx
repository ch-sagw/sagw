import 'server-only';
import React, { Fragment } from 'react';
import { InterfaceDownloadLinkItemPropTypes } from '@/components/base/DownloadLinkItem/DownloadLinkItem';
import {
  Document, InterfaceDownloadsBlock,
  Project,
  ZenodoDocument,
} from '@/payload-types';
import { InterfaceRte } from '@/components/base/types/rte';
import { rteToHtml } from '@/utilities/rteToHtml';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { DownloadsComponent } from '@/components/blocks/Downloads/Downloads.component';

export type InterfaceDownloadsPropTypes = {
  title: InterfaceRte;
  tenant: string;
} & InterfaceDownloadsBlock;

export const Downloads = async (props: InterfaceDownloadsPropTypes): Promise<React.JSX.Element> => {
  const title = rteToHtml(props.title);
  const payload = await getPayloadCached();
  let projectId;

  if (props.project) {
    if (typeof props.project === 'string') {
      projectId = props.project;
    } else if (typeof props.project === 'object') {
      const projectObject = props.project as Project;

      projectId = projectObject.id;
    }
  }

  const returnDocumentItems: InterfaceDownloadLinkItemPropTypes[] = [];

  let downloadsToIterate: { relationTo: 'documents' | 'zenodoDocuments'; value: Document | ZenodoDocument }[] | undefined;

  if (props.customOrAuto === 'auto' && projectId) {
    const projectDocuments = await payload.find({
      collection: 'documents',
      where: {
        project: {
          equals: projectId,
        },
        tenant: {
          equals: props.tenant,
        },
      },
    });

    const projectZenodoDocuments = await payload.find({
      collection: 'zenodoDocuments',
      where: {
        project: {
          equals: projectId,
        },
        tenant: {
          equals: props.tenant,
        },
      },
    });

    // transform documents to match expected structure
    downloadsToIterate = [
      ...projectDocuments.docs.map((doc) => ({
        relationTo: 'documents' as const,
        value: doc,
      })),
      ...projectZenodoDocuments.docs.map((doc) => ({
        relationTo: 'zenodoDocuments' as const,
        value: doc,
      })),
    ];
  } else if (props.customOrAuto === 'custom' && props.downloads) {
    downloadsToIterate = props.downloads as { relationTo: 'documents' | 'zenodoDocuments'; value: Document | ZenodoDocument }[];
  }

  downloadsToIterate?.forEach((item) => {
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
    <DownloadsComponent
      title={title}
      subtitle={props.subtitle
        ? rteToHtml(props.subtitle)
        : undefined
      }
      items={returnDocumentItems}
    />
  );
};
