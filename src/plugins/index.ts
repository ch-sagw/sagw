import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { seoPlugin } from '@payloadcms/plugin-seo';
import {
  GenerateTitle, GenerateURL,
} from '@payloadcms/plugin-seo/types';
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant';
import {
  sentryPlugin,
  PluginOptions as sentryPluginOptions,
} from '@payloadcms/plugin-sentry';

import { Plugin } from 'payload';
import { Images } from '@/collections/Plc/Images';
import { Videos } from '@/collections/Plc/Videos';
import { Documents } from '@/collections/Plc/Documents';
import { getServerSideURL } from '@/utilities/getUrl';
import type { Config } from '@/payload-types';
import { isSuperAdmin } from '@/access/isSuperAdmin';
import { getUserTenantIDs } from '@/utilities/getUserTenantIds';
import { tenantsCollections } from '@/collections';
import { Svgs } from '@/collections/Plc/Svgs';

import * as Sentry from '@sentry/nextjs';

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

type ExtendedPluginOptions = sentryPluginOptions & {
  debug?: boolean
  enabled?: boolean
}

const plugins: Plugin[] = [
  vercelBlobStorage({
    clientUploads: true,
    collections: {
      [Images.slug]: true,
      [Videos.slug]: true,
      [Documents.slug]: true,
      [Svgs.slug]: true,
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
    generateURL,
  }),
  multiTenantPlugin<Config>({
    cleanupAfterTenantDelete: false,
    collections: tenantsCollections,
    tenantField: {
      access: {
        read: () => true,
        update: ({
          req,
        }) => {
          if (isSuperAdmin(req.user)) {
            return true;
          }

          return getUserTenantIDs(req.user).length > 0;
        },
      },
    },
    tenantsArrayField: {
      includeDefaultField: false,
    },
    userHasAccessToAllTenants: (user) => isSuperAdmin(user),
  }),

];

export default plugins;
