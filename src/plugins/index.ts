import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { seoPlugin } from '@payloadcms/plugin-seo';
import {
  GenerateTitle, GenerateURL,
} from '@payloadcms/plugin-seo/types';

import { Plugin } from 'payload';
import { Media } from '@/collections/Media';
import { getServerSideURL } from '@/utilities/getUrl';

const generateTitle: GenerateTitle = ({
  doc,
}) => (doc?.title
  ? `${doc.title} | SAGW`
  : 'SAGW');

const generateURL: GenerateURL = ({
  doc,
}) => {
  const url = getServerSideURL();

  return doc?.slug
    ? `${url}/${doc.slug}`
    : url;
};

const plugins: Plugin[] = [
  vercelBlobStorage({
    clientUploads: true,
    collections: {
      [Media.slug]: true,
    },
    enabled: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
];

export default plugins;
