import { NextRequest } from 'next/server';
import {
  createPdfGenerationAuth,
  isPdfGenerationEnabled,
} from '@/utilities/pdfGenerationSecurity';
import { sanitizePdfExportPath } from '@/utilities/sanitizePdfExportPath';

export const runtime = 'nodejs';

// this endpoint must be evaluated at request time so the returned token is
// fresh (TTL 5 min). The magazine detail pages that call it are statically
// rendered, which is exactly why we don't want the token baked into the
// page HTML.
export const dynamic = 'force-dynamic';

export const GET = (req: NextRequest): Response => {
  if (!isPdfGenerationEnabled()) {
    return Response.json({
      error: 'pdf_generation_disabled',
    }, {
      headers: {
        'Cache-Control': 'no-store',
      },
      status: 503,
    });
  }

  const rawPath = req.nextUrl.searchParams.get('path');

  if (!rawPath) {
    return Response.json({
      error: 'missing_path',
    }, {
      headers: {
        'Cache-Control': 'no-store',
      },
      status: 400,
    });
  }

  const sanitizedPath = sanitizePdfExportPath(rawPath);

  if (!sanitizedPath) {
    return Response.json({
      error: 'invalid_path',
    }, {
      headers: {
        'Cache-Control': 'no-store',
      },
      status: 400,
    });
  }

  const auth = createPdfGenerationAuth({
    path: sanitizedPath,
  });

  if (!auth) {
    return Response.json({
      error: 'pdf_generation_disabled',
    }, {
      headers: {
        'Cache-Control': 'no-store',
      },
      status: 503,
    });
  }

  return Response.json({
    expiresAt: auth.expiresAt,
    path: sanitizedPath,
    token: auth.token,
  }, {
    headers: {
      'Cache-Control': 'no-store',
    },
    status: 200,
  });
};
