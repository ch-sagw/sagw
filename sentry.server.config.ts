// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  // Setting this option to true will print useful information to the console
  // while you're setting up Sentry.
  debug: false,

  dsn: 'https://ff825b055c033f18e44cc08059197dc5@o4509054769299456.ingest.de.sentry.io/4509085121773648',

  // Define how likely traces are sampled. Adjust this value in production,
  // or use tracesSampler for greater control.
  tracesSampleRate: 1,

});
