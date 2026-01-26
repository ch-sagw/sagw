// TODO: migrate middleware to proxy once next16 is installed

import createMiddleware from 'next-intl/middleware';
import { routing } from '../../i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next`, `/_vercel` or `/admin`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|_next|_vercel|admin|next|.*\\..*).*)',
};

