import { NextRequest } from 'next/server';
import { getPayload } from 'payload';
import { headers as nextHeaders } from 'next/headers';
import configPromise from '@/payload.config';
import { buildBreadcrumbs } from '@/utilities/buildBreadcrumbs';
import { InterfaceInternalLinkValue } from '@/payload-types';

export const runtime = 'nodejs';

type BreadcrumbPreviewBody = {
  parentPage?: InterfaceInternalLinkValue | null | Record<string, never>;
};

// Used by the admin BreadcrumbField preview to compute breadcrumbs on the
// fly from the currently selected parentPage reference in the edit form.
export const POST = async (req: NextRequest): Promise<Response> => {
  const payload = await getPayload({
    config: configPromise,
  });

  const reqHeaders = await nextHeaders();
  const {
    user,
  } = await payload.auth({
    headers: reqHeaders,
  });

  if (!user) {
    return Response.json({
      error: 'Unauthorized',
    }, {
      status: 401,
    });
  }

  let body: BreadcrumbPreviewBody = {};

  try {
    body = await req.json();
  } catch {
    return Response.json({
      error: 'Invalid JSON body',
    }, {
      status: 400,
    });
  }

  const breadcrumb = await buildBreadcrumbs({
    parentRef: body.parentPage,
    payload,
  });

  return Response.json({
    breadcrumb: breadcrumb ?? [],
  });
};
