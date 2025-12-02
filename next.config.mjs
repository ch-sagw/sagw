import './.env/index.js';
import { withSentryConfig } from '@sentry/nextjs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { withPayload } from '@payloadcms/next/withPayload';
import createNextIntlPlugin from 'next-intl/plugin';

const rootFileName = fileURLToPath(import.meta.url);
const rootDirName = path.dirname(rootFileName);

const NEXT_PUBLIC_SERVER_URL = process.env.URL ||
  process.env.DEPLOY_URL ||
  'http://localhost:3000';

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item);

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        };
      }),
    ],
  },
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.resolve(rootDirName, 'src/styles')],
    silenceDeprecations: [
      'import',
      'legacy-js-api',
    ],
  },
};

const configWithPayload = withPayload(nextConfig, {
  devBundleServerPackages: false,
});

const configWithSentry = withSentryConfig(configWithPayload, {
  authToken: process.env.SENTRY_AUTH_TOKEN,
  automaticVercelMonitors: true,
  disableLogger: true,
  org: process.env.SENTRY_PROJECT,
  project: process.env.SENTRY_ORG,
  silent: !process.env.CI,
  tunnelRoute: '/monitoring',
  widenClientFileUpload: true,
});

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(configWithSentry);
