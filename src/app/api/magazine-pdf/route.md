# Magazine PDF API Route

## Purpose

The route generates a downloadable PDF for magazine detail pages.

The client triggers this endpoint from the export button in the hero component. The route renders the page in headless Chromium and returns a PDF response.

## High-Level Flow

1. User opens a magazine detail page. **No token is rendered into the HTML.** 
2. User clicks "Export article".
3. Client calls `GET /api/magazine-pdf/token?path=<currentPathname>` and receives `{ token, expiresAt, path }`.
4. Client calls `GET /api/magazine-pdf?path=<path>&token=<token>&expiresAt=<unixSeconds>`.
5. API validates token and expiry.
6. If valid, API launches headless browser, renders the page, and returns the PDF as an attachment.

## Routes

### `GET /api/magazine-pdf/token`

Generates a fresh token for the supplied `path`. `force-dynamic`, never cached.

- `200` — returns `{ token: string, expiresAt: number, path: string }`
- `400` — `path` missing or invalid (see sanitization rules in `src/utilities/sanitizePdfExportPath.ts`)
- `503` — PDF generation disabled (no secret configured)

### `GET /api/magazine-pdf`

Renders the requested path in headless Chromium and streams the PDF.

- `200` — `application/pdf`, `Content-Disposition: attachment; filename="<slug>.pdf"`
- `400` — missing/invalid `path`
- `401` — missing/invalid/expired `token` or `expiresAt`
- `500` — rendering failed; body is `Failed to generate PDF (<phase>): <message>` where `<phase>` is one of `launch` / `goto` / `pdf`, matching the same tag in the server log
- `503` — PDF generation disabled

## Token Auth Flow

Token auth is implemented in `src/utilities/pdfGenerationSecurity.ts`.

### Token creation

- The server creates token data from:
  - `path` (pathname)
  - `expiresAt` (current time + 5 minutes)
- Token is generated as:
  - `HMAC_SHA256(PDF_GENERATION_SECRET, "<path>:<expiresAt>")`

### Token verification

The route only generates a PDF when all checks pass:

1. PDF generation is enabled (secret available)
2. `token` and `expiresAt` query params are present
3. `path` is sanitized and valid
4. `expiresAt` is not in the past
5. Recomputed token matches provided token (timing-safe comparison)

See the per-status failure codes in the "Routes" section above.

## Environment Variables

### `PDF_GENERATION_SECRET`

Primary server secret used for HMAC signing.

- **Production**: required
- **Local development**: optional (there is a dev fallback secret)

Example value generation:

```bash
openssl rand -hex 32
```
