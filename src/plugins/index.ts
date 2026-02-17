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

const generateTitle: GenerateTitle = ({
  doc,
}) => (doc?.adminTitle
  ? `${doc.adminTitle} | SAGW`
  : 'SAGW');

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
