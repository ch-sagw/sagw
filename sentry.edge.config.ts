import * as Sentry from '@sentry/nextjs';

Sentry.init({
  debug: false,
  dsn: 'https://ff825b055c033f18e44cc08059197dc5@o4509054769299456.ingest.de.sentry.io/4509085121773648',
  tracesSampleRate: 1,
});
