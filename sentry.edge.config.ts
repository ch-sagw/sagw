import * as Sentry from '@sentry/nextjs';

import { isAdminRoute } from './src/utilities/isAdminRoute';

if (process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'production') {
  Sentry.init({
    beforeSend(event) {
      if (isAdminRoute(event.request?.url)) {
        return null;
      }

      return event;
    },
    beforeSendTransaction(event) {
      if (
        isAdminRoute(event.request?.url) ||
        isAdminRoute(event.transaction)
      ) {
        return null;
      }

      return event;
    },
    debug: false,
    dsn: 'https://ff825b055c033f18e44cc08059197dc5@o4509054769299456.ingest.de.sentry.io/4509085121773648',
    tracesSampleRate: 1,
  });
}
