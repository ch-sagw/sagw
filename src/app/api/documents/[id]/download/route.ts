import { getPayloadCached } from '@/utilities/getPayloadCached';
import { routing } from '@/i18n/routing';
import { rte1ToPlaintext } from '@/utilities/rte1ToPlaintext';
import { TypedLocale } from 'payload';
import slugify from 'slugify';

export const runtime = 'nodejs';

const getFileExtension = (filename?: null | string): string => {
  const extension = filename?.split('.')
    .pop()
    ?.trim()
    .toLowerCase();

  return extension && (/^[a-z0-9]+$/u).test(extension)
    ? extension
    : 'pdf';
};

const isPdfDocument = ({
  filename,
  mimeType,
}: {
  filename?: null | string;
  mimeType?: null | string;
}): boolean => {
  const rawExtension = filename?.split('.')
    .pop()
    ?.trim()
    .toLowerCase();

  return rawExtension === 'pdf' && mimeType === 'application/pdf';
};

const buildDownloadFilename = ({
  extension,
  title,
}: {
  extension: string;
  title: string;
}): string => `${title || 'document'}.${extension}`;

const escapeQuotedFilename = (value: string): string => value
  .replaceAll('\\', '\\\\')
  .replaceAll('"', '\\"');

const buildAsciiFilename = ({
  extension,
  title,
}: {
  extension: string;
  title: string;
}): string => {
  const slug = slugify(title || 'document', {
    lower: false,
    strict: true,
    trim: true,
  });

  return `${slug || 'document'}.${extension}`;
};

export const GET = async (
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
): Promise<Response> => {
  const {
    id,
  } = await params;
  const payload = await getPayloadCached();
  const requestUrl = new URL(request.url);

  // security: check if it is a valid locale
  const rawLocale = requestUrl.searchParams.get('locale');
  const locale = rawLocale && routing.locales.includes(rawLocale as TypedLocale)
    ? rawLocale as TypedLocale
    : null;

  if (rawLocale && !locale) {
    return new Response('Invalid locale.', {
      status: 400,
    });
  }

  const document = await payload.findByID({
    collection: 'documents',
    id,
    locale: locale || undefined,
  });

  if (!document.url) {
    return new Response('Document file URL not found.', {
      status: 404,
    });
  }

  if (!isPdfDocument({
    filename: document.filename,
    mimeType: document.mimeType,
  })) {
    return new Response('Invalid document file type.', {
      status: 400,
    });
  }

  // security: only allow know vercel blob url

  const blobUrl = process.env.BLOB_URL;

  if (!blobUrl) {
    return new Response('Blob URL is not configured.', {
      status: 500,
    });
  }

  let allowedBlobOrigin: string;
  let documentUrl: URL;

  try {
    allowedBlobOrigin = (new URL(blobUrl)).origin;
    documentUrl = new URL(document.url);
  } catch {
    return new Response('Invalid document URL configuration.', {
      status: 500,
    });
  }

  if (documentUrl.origin !== allowedBlobOrigin) {
    return new Response('Invalid document file host.', {
      status: 400,
    });
  }

  const upstreamResponse = await fetch(documentUrl.toString());

  if (!upstreamResponse.ok || !upstreamResponse.body) {
    return new Response('Failed to fetch document file.', {
      status: 502,
    });
  }

  const plainTitle = rte1ToPlaintext(document.title)
    .trim();
  const extension = getFileExtension(document.filename);
  const downloadFilename = buildDownloadFilename({
    extension,
    title: plainTitle,
  });
  const headers = new Headers();
  const contentLength = upstreamResponse.headers.get('content-length');

  headers.set(
    'Content-Disposition',
    `attachment; filename="${escapeQuotedFilename(buildAsciiFilename({
      extension,
      title: plainTitle,
    }))}"; filename*=UTF-8''${encodeURIComponent(downloadFilename)}`,
  );
  headers.set(
    'Content-Type',
    upstreamResponse.headers.get('content-type') || document.mimeType || 'application/pdf',
  );

  if (contentLength) {
    headers.set('Content-Length', contentLength);
  }

  return new Response(upstreamResponse.body, {
    headers,
    status: 200,
  });
};
