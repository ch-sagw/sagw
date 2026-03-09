# Magazine PDF API Route

## Purpose

The route generates a downloadable PDF for magazine detail pages.

The client triggers this endpoint from the export button in the hero component. The route renders the page in headless Chromium and returns a PDF response.

## High-Level Flow

1. User opens a magazine detail page.
2. Server renders the page and creates a short-lived auth token (`token`) + expiry (`expiresAt`) for the current path.
3. User clicks "Export article".
4. Browser calls: `/api/magazine-pdf?path=<currentPathAndQuery>&token=<token>&expiresAt=<unixSeconds>`
5. API validates token and expiry.
6. If valid, API launches headless browser, renders the page, and returns PDF as attachment.

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

On failure:

- `401` for missing/invalid/expired token
- `503` when PDF generation is disabled (no secret in production)

## Environment Variables

### `PDF_GENERATION_SECRET`

Primary server secret used for HMAC signing.

- **Production**: required
- **Local development**: optional (there is a dev fallback secret)

Example value generation:

```bash
openssl rand -hex 32
```
