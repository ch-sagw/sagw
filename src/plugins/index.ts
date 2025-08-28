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
import { isGlobalAdmin } from '@/access/isGlobalAdmin';
import { getUserDepartmentIDs } from '@/utilities/getUserDepartmentIds';
import { tenantsCollections } from '@/collections';

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
    collections: tenantsCollections,
    tenantField: {
      access: {
        read: () => true,
        update: ({
          req,
        }) => {
          if (isGlobalAdmin(req.user)) {
            return true;
          }

          return getUserDepartmentIDs(req.user).length > 0;
        },
      },
      name: 'department',
    },
    tenantsArrayField: {
      arrayFieldName: 'departments',
      arrayTenantFieldName: 'department',
      includeDefaultField: false,
    },
    tenantsSlug: 'departments',
    userHasAccessToAllTenants: (user) => isGlobalAdmin(user),
  }),
];

export default plugins;
