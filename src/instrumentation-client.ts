import * as Sentry from '@sentry/nextjs';
import { initBotId } from 'botid/client/core';

import { isAdminRoute } from '@/utilities/isAdminRoute';

// Form submissions are Next.js server actions, which POST to the URL of
// the page they are invoked from. Forms (form block, newsletter) can be
// placed on any frontend page, so every locale-prefixed page path needs
// BotID protection. The locale list mirrors src/i18n/payloadConfig.ts
// (kept hardcoded here to avoid pulling payload code into the client
// bundle). checkBotId() is then enforced server-side in
// src/app/actions/submitForm.ts.
const frontendLocales = [
  'de',
  'fr',
  'it',
  'en',
];

initBotId({
  protect: frontendLocales.flatMap((locale) => [
    {
      method: 'POST',
      path: `/${locale}`,
    },
    {
      method: 'POST',
      path: `/${locale}/*`,
    },
  ]),
});

if (process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'production') {
  Sentry.init({
    beforeSend(event) {
      if (
        isAdminRoute(event.request?.url) ||
        isAdminRoute(globalThis.location?.pathname)
      ) {
        return null;
      }

      return event;
    },
    beforeSendTransaction(event) {
      if (
        isAdminRoute(event.request?.url) ||
        isAdminRoute(event.transaction) ||
        isAdminRoute(globalThis.location?.pathname)
      ) {
        return null;
      }

      return event;
    },
    debug: false,
    dsn: 'https://ff825b055c033f18e44cc08059197dc5@o4509054769299456.ingest.de.sentry.io/4509085121773648',
    integrations: [Sentry.replayIntegration()],
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    tracesSampleRate: 1,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
