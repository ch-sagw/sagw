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

/**
 * CSP Headers
 * Gravatar is needed within Payload,
 * that's why it's in the list.
 */
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' https://vercel.live 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' https://www.gravatar.com https://*.gumlet.io data: blob:;
  font-src 'self' data:;
  connect-src 'self' https:;
  frame-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
`.replace(/\n/gu, ' ')
  .trim();

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  headers() {
    return [
      {
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy,
          },
        ],
        source: '/(.*)',
      },
    ];
  },
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
