import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { seoPlugin } from '@payloadcms/plugin-seo';
import {
  GenerateTitle, GenerateURL,
} from '@payloadcms/plugin-seo/types';
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant';

import { Plugin } from 'payload';
import { Images } from '@/collections/Images';
import { Videos } from '@/collections/Videos';
import { Documents } from '@/collections/Documents';
import { getServerSideURL } from '@/utilities/getUrl';
import type { Config } from '@/payload-types';
import { isGlobalAdmin } from '@/access/isGlobalAdmin';
import { getUserDepartmentIDs } from '@/utilities/getUserDepartmentIds';

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
      [Images.slug]: true,
      [Videos.slug]: true,
      [Documents.slug]: true,
    },
    enabled: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),

  multiTenantPlugin<Config>({
    collections: {
      instituteDetail: {},
      magazineOverview: {
        isGlobal: true,
      },
      network: {
        isGlobal: true,
      },
    },
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
