import createMiddleware from 'next-intl/middleware';
import {
  NextRequest,
  NextResponse,
} from 'next/server';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export const proxy = function proxy(request: NextRequest): NextResponse {
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set('x-pathname', request.nextUrl.pathname);
  requestHeaders.set('x-url', request.url);

  return intlMiddleware(new NextRequest(request, {
    headers: requestHeaders,
  }));
};

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next`, `/_vercel` or `/admin`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|_next|_vercel|admin|next|.*\\..*).*)',
};
