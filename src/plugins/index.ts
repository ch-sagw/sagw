import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { seoPlugin } from '@payloadcms/plugin-seo';
import { GenerateTitle } from '@payloadcms/plugin-seo/types';
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant';
import {
  sentryPlugin,
  PluginOptions as sentryPluginOptions,
} from '@payloadcms/plugin-sentry';

import { Plugin } from 'payload';
import { Images } from '@/collections/Plc/Images';
import { Videos } from '@/collections/Plc/Videos';
import { Documents } from '@/collections/Plc/Documents';
import type { Config } from '@/payload-types';
import { tenantsCollections } from '@/collections';

import * as Sentry from '@sentry/nextjs';
import { tenantsAccess } from '@/access/tenants';
import { userIsSuperAdmin } from '@/collections/Plc/Users/roles';
import { encodeURLPath } from '@/utilities/encodeURLPath';

const generateTitle: GenerateTitle = ({
  doc,
}) => (doc?.adminTitle
  ? `${doc.adminTitle} | SAGW`
  : 'SAGW');

// Since video/image collections have disablePayloadAccessControl set to
// true, they would point to the vercel blob url. we rewrite the file url
// so that they point to the gumlet url.
const gumletHost = process.env.NEXT_PUBLIC_GUMLET_URL?.replace(/\/$/u, '');
const generateGumletFileURL = ({
  filename,
  prefix,
  url,
}: {
  filename?: null | string
  prefix?: null | string
  url?: null | string
}): string => {
  if (!gumletHost) {
    return url || '';
  }

  const path = [
    prefix,
    filename,
  ]
    .filter(Boolean)
    .join('/');

  return path
    ? `${gumletHost}/${encodeURLPath(path)}`
    : gumletHost;
};

type ExtendedPluginOptions = sentryPluginOptions & {
  debug?: boolean
  enabled?: boolean
}

const plugins: Plugin[] = [
  vercelBlobStorage({
    addRandomSuffix: true,
    clientUploads: false,

    // public collections should link directly to Blob instead of the
    // payload file endpoint, which applies collection read access and
    // returns 403.
    collections: {
      [Images.slug]: {
        disablePayloadAccessControl: true,
        generateFileURL: generateGumletFileURL,
      },
      [Videos.slug]: {
        disablePayloadAccessControl: true,
      },
      [Documents.slug]: {
        disablePayloadAccessControl: true,
      },
    },
    enabled: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  }),
  sentryPlugin({
    Sentry,
    options: <ExtendedPluginOptions> {
      captureErrors: [
        400,
        403,
        404,
        500,
      ],
      context: ({
        defaultContext,
        req,
      }: {
        defaultContext: any;
        req: any
      }) => ({
        ...defaultContext,
        tags: {
          locale: req.locale,
        },
      }),
      debug: true,
      enabled: true,
    },
  }),
  seoPlugin({
    generateTitle,
  }),
  multiTenantPlugin<Config>({
    cleanupAfterTenantDelete: false,
    collections: tenantsCollections,
    tenantField: {
      access: tenantsAccess,
    },
    tenantsArrayField: {
      includeDefaultField: false,
    },
    userHasAccessToAllTenants: (user) => userIsSuperAdmin(user),
  }),

];

export default plugins;
