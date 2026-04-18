import {
  NextRequest,
  NextResponse,
} from 'next/server';

// Payload's built-in `GET /api/access` returns, without authentication,
// the full collection + field tree together with the per-field
// `read`/`update` booleans for the current user. For anonymous callers
// this is a free map of the admin schema (collection slugs, nested
// field paths, currently world-writable fields). Gate the endpoint on
// the presence of the `payload-token` cookie so only (potentially)
// authenticated callers reach Payload's handler. Payload itself still
// enforces access rules against the token server-side.
export const proxy = (request: NextRequest): NextResponse => {
  const payloadToken = request.cookies.get('payload-token');

  if (!payloadToken) {
    return new NextResponse('Unauthorized', {
      status: 401,
    });
  }

  return NextResponse.next();
};

export const config = {
  matcher: '/api/access',
};
