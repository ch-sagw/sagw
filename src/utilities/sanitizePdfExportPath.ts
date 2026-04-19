import 'server-only';

/**
 * Validates that a user-supplied path is safe to use for same-origin PDF
 * rendering and returns the query-stripped pathname if it is.
 *
 * Rules:
 *   - must start with a single "/" (rejects protocol-relative "//...")
 *   - must be pure ASCII (no control chars or unicode tricks)
 *   - must not contain ".." segments (no directory traversal)
 *
 * Any query string is discarded - callers should sign/verify the pathname
 * only, which is what both the token route and the pdf route do.
 */
export const sanitizePdfExportPath = (pathValue: string): string | null => {
  if (typeof pathValue !== 'string' || pathValue.length === 0) {
    return null;
  }

  if (!pathValue.startsWith('/') || pathValue.startsWith('//')) {
    return null;
  }

  if ((/[^\x20-\x7E]/u).test(pathValue)) {
    return null;
  }

  const [withoutQuery] = pathValue.split('?');

  if (!withoutQuery) {
    return null;
  }

  if (withoutQuery.split('/')
    .some((segment) => segment === '..')) {
    return null;
  }

  return withoutQuery;
};
