# Security Audit: Verification + Additional Findings

Date: 2026-04-18
Target: `http://localhost:3000/admin`, `http://localhost:3000/de`
Tested as: unauthenticated (primary), tenant-admin, super-admin (where relevant)

This document verifies the findings from the prior security audit
(`2026-04-14`) and lists additional issues discovered during follow-up
review.

---

## Part 1 — Verification of Reported Findings

### 1. CRITICAL: Tenants unauth read/update — CONFIRMED (with nuance)

**Reproduction:**

```
GET    /api/tenants?limit=2    → 200 OK, full tenant list returned
GET    /api/tenants/<id>       → 200 OK, full tenant record
PATCH  /api/tenants/<id>       → 200 OK, "Updated successfully."
POST   /api/tenants            → 403
DELETE /api/tenants/<id>       → 403
```

**Nuance not in the original report:**

- The PATCH returns `200 OK` but the individual field values are not
  changed, because each field (`name`, `title`, `url`, `faviconName`,
  `slug`, `languages.*`) has its own field-level `access.update` set to
  an admin-only check. So today, an unauth PATCH only bumps `updatedAt`
  and triggers any `beforeChange` / `afterChange` hooks.
- It is **still exploitable**: the collection-level `update: allAccess`
  means any field NOT covered by `fieldsAccess` in the future (a
  forgotten migration, a new field added without field-level access, a
  field injected by a plugin) would be writable. It is also noisy: it
  triggers hooks and timestamp changes on every call.

**Additional discovery in the same area:** `src/plugins/index.ts`
configures the multi-tenant plugin with
`tenantField: { access: tenantsAccess }`. Every collection that uses
the multi-tenant plugin inherits the leaky access object on its
`tenant` relationship field.

**Fix** — in `src/access/tenants.ts`:

```tsx
const readAccess = ({ req }: InterfaceAccessParam): AccessResult => {
  if (!req.user) return false;
  if (isSuperAdmin(req)) return true;
  // tenant admins only see tenants they belong to
  const ids = getUserTenantIDs(req.user);
  return { id: { in: ids } };
};

const updateAccess = ({ req }: InterfaceAccessParam): boolean =>
  isSuperAdmin(req) || isTenantAdmin(req);

export const tenantsAccess = {
  create: tenantFieldCreateAccess,
  delete: tenantFieldDeleteAccess,
  read: readAccess,
  update: updateAccess,
};
```

Frontend rendering continues to work because
`getPayloadCached().find({ collection: 'tenants' })` is called
server-side without `user`, which bypasses access control by default.

---

### 2. HIGH: Client-controlled form definition — CONFIRMED and more severe than reported

The original report calls out newsletter list ID tampering. It is worse
than that. In `src/app/actions/submitForm.ts`:

```48:55:src/app/actions/submitForm.ts
export const submitForm = async (prevState: any, formData: FormData): Promise<SubmitFormResult> => {

  const hiddenFormData: InterfaceForm = JSON.parse(formData.get(hiddenFormDefinitionFieldName) as string);
  const hiddenUrl: string = formData.get(hiddenPageUrl) as string;
```

```148:154:src/app/actions/submitForm.ts
  if (hiddenFormData.isNewsletterForm === 'custom') {
    const mailResult = await sendMail({
      content: generateMailContent(formData, hiddenFormData, hiddenUrl),
      from: process.env.MAIL_SENDER_ADDRESS,
      subject: hiddenFormData.mailSubject || '',
      to: hiddenFormData.recipientMail || '',
    });
```

The entire `form` object (recipient email, subject, field list, list
IDs) comes from a hidden input the client controls. This enables:

1. **Arbitrary email relay** — an attacker can call this server action
   with a tampered `formDefinition` that sets `recipientMail` to any
   address, `mailSubject` to attacker-chosen text, and inject the body
   via the dynamic `fields[]` array. The `from` is your own verified
   Resend sender. You become a spam gateway signed with your domain's
   reputation.
2. **Newsletter list ID tampering** — an attacker can move addresses
   into arbitrary Brevo list IDs.
3. **URL spoofing** — the `URL:` line at the top of the email body
   comes from a hidden input (`hiddenPageUrl`), also trivially
   tamperable.

Good news: `Form.server.tsx` already does
`payload.findByID({ collection: 'forms', id: formId })` to re-fetch the
form server-side for rendering. The action needs the same treatment.

**Fix** — submit only a stable form id, re-fetch authoritative
definition server-side:

```tsx
// Form.component.tsx (client)
<input type='hidden' name='formId' value={String(form.id)} />
<input type='hidden' name={hiddenPageUrl} value={pathname} />
```

```tsx
// src/app/actions/submitForm.ts
const formId = formData.get('formId') as string;
if (!formId) return { success: false };

const payload = await getPayload({ config });
const authoritativeForm = await payload.findByID({
  collection: 'forms',
  id: formId,
  // no user → overrideAccess default, fine for rendering-equivalent read
});

if (!authoritativeForm) return { success: false };

// Use authoritativeForm.recipientMail, .mailSubject, .fields, .newsletterFields.*
// and ONLY validate/read formData values keyed by authoritativeForm.fields[].name
// also validate hiddenUrl is same-origin before echoing into the email body.
```

Also consider:

- Locale-resolving the form (the server fetch needs the current locale).
- Rate-limiting the action (e.g. 5 submits per minute per IP + form id).
- Validating `hiddenPageUrl` begins with `/` and contains no CR/LF
  before embedding into the mail HTML.

---

### 3. MEDIUM: Missing browser security headers — CONFIRMED

Response headers from `/admin` and `/de` contain no
`Content-Security-Policy`, `Strict-Transport-Security`,
`X-Frame-Options`, or `Referrer-Policy`. The commented-out CSP block
in `next.config.mjs` (lines 23–50, 82–94) needs to be re-enabled.

**Fix** — uncomment and test the existing CSP block, plus add:

```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ];
},
```

Note on CSP: the Payload admin needs `'unsafe-inline' 'unsafe-eval'` on
`script-src` (already in the commented block). Validate carefully in
staging. Gumlet, Resend tracking, Sentry `tunnelRoute: '/monitoring'`,
and Vercel Blob need allowlisting.

---

### 4. MEDIUM: No login rate limiting — CONFIRMED

25 bad logins against `super-admin@vorhall.com` returned 25× `401`,
with no throttling and no lockout. Payload has this built in and it is
just not turned on. In `src/collections/Plc/Users/index.ts`:

```tsx
export const Users: CollectionConfig = {
  access: usersAccess,
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 min
    // tokenExpiration: 2 * 60 * 60, // optional
    // verify: true, // if you also want email verification for new users
  },
  // ...
};
```

For IP-level limits in front of `/api/users/login`, consider middleware
(e.g. Upstash Ratelimit or a Vercel WAF rate-limit rule).

---

### 5. LOW: GraphQL Playground public — CONFIRMED

`GET /api/graphql-playground` returns `200 text/html` unauth. `POST
/api/graphql` currently returns `500` on real queries (likely failing
inside an access rule), but the Playground UI is still reachable.

**Fix** — delete or gate by env:

```tsx
// src/app/(payload)/api/graphql-playground/route.ts
import config from '@payload-config'
import '@payloadcms/next/css'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

export const GET = process.env.ENV === 'prod'
  ? () => new Response('Not found', { status: 404 })
  : GRAPHQL_PLAYGROUND_GET(config);
```

Apply the same treatment to `src/app/(payload)/api/graphql/route.ts`
if nothing in the app actually needs GraphQL at runtime (you are
already using REST + Local API everywhere).

---

## Part 2 — Additional Findings (not in the original report)

### A. HIGH: `/api/access` enumerates full admin schema to anonymous users

```
GET /api/access   → 200, ~18 KB JSON
```

Without any auth, this endpoint returns a tree of every collection,
every nested field name (`meta.seo.index`, `_watchTenant`,
`languages.de`, `parentPage.documentId`, etc.), and the booleans
showing what is read/update-able for the current user. For an attacker
this is a free map of the admin schema — collection slugs, field
paths, and currently world-writable fields (`tenants.languages.update:
true`, `tenants.updatedAt.update: true`, etc., directly reflecting
Finding 1).

This is a Payload built-in endpoint controlled by collection access
rules. Fixing Finding 1 will remove `update: true` for `tenants` from
the public output, but the endpoint still enumerates every
collection's field tree.

**Fix** — gate the route with middleware in production:

```tsx
// src/middleware.ts (or extend existing)
if (request.nextUrl.pathname === '/api/access') {
  const payloadToken = request.cookies.get('payload-token');
  if (!payloadToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
}
```

---

### B. MEDIUM: User enumeration via `/api/users/forgot-password`

```
POST /api/users/forgot-password { email: "super-admin@vorhall.com" }
  → 403 "Error sending email: 403 validation_error - The sagw.ch
     domain is not verified..."

POST /api/users/forgot-password { email: "nonexistent@example.com" }
  → 200 {"message":"Success"}
```

Two leaks in one:

1. **Enumeration** — the response body and status code differ between
   known and unknown addresses. An attacker can confirm which email
   addresses have admin accounts (and specifically which ones are
   super-admins if they have guesses like `admin@sagw.ch`).
2. **Internal config leak** — the Resend `403 validation_error`
   message leaks sender domain configuration status to the public.

The enumeration is a Payload + Resend interaction. When Resend is
correctly configured on production the "domain unverified" leak will
go away, but the **timing/status difference between known and unknown
emails will remain** unless explicitly suppressed.

**Fix** — override the route with a handler that always returns the
same response regardless of outcome and logs errors server-side only:

```tsx
// src/app/(payload)/api/users/forgot-password/route.ts (custom override)
import { NextRequest } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export const POST = async (req: NextRequest) => {
  const { email } = await req.json();
  const payload = await getPayload({ config });

  try {
    await payload.forgotPassword({
      collection: 'users',
      data: { email },
      disableEmail: false,
    });
  } catch (err) {
    payload.logger.warn({ err, email }, 'forgotPassword failed');
  }

  return Response.json({ message: 'If that email exists, a reset link has been sent.' });
};
```

---

### C. MEDIUM: No CORS / CSRF allowlist configured

`src/payload.config.ts` has no `cors` or `csrf` entries. The response
to `/api/tenants` includes:

```
access-control-allow-methods: PUT, PATCH, POST, GET, DELETE, OPTIONS
```

Defaults are permissive. With no `csrf: [...]` allowlist, the
`payload-token` cookie (SameSite=Lax by default in Payload) still
benefits from browser SameSite protection against most CSRF, but an
explicit allowlist is defense-in-depth and particularly useful here
because the `setCookieBasedOnDomain` hook hints that multiple
hostnames may host the admin (`relatedOrg` by `host`).

**Fix**:

```tsx
// payload.config.ts
export default buildConfig({
  // ...
  cors: [
    'https://www.sagw.ch',
    'https://admin.sagw.ch',
    // plus all tenant urls
  ].filter(Boolean),
  csrf: [
    'https://www.sagw.ch',
    'https://admin.sagw.ch',
    // plus all tenant urls
  ].filter(Boolean),
});
```

---

### D. LOW: `roles` not saved to JWT

`src/collections/Plc/Users/index.ts` — the `roles` select field is
missing `saveToJWT: true`. Every access check calling
`isSuperAdmin(req)` reads `req.user.roles` from the JWT (works), but
the multi-tenant admin permission paths traverse `user.tenants[].roles`,
which requires a DB populate on every request. Not a leak, but it
explains some perf cost and keeps an attack surface warm. Consider
`saveToJWT: true` on the top-level `roles` field at minimum.

---

### E. LOW: `admin.hideAPIURL` is cosmetic only

Many collections use `hideAPIURL: process.env.ENV === 'prod'`. This
only hides the "API URL" copy-button in the admin UI. It does not
block the underlying REST route. The route remains reachable. This is
fine as long as the access rules are correct; it is called out so it
is not mistaken for a defense mechanism.

---

### F. Informational: SafeHtml sink review

`SafeHtml` is fed only by `rteToHtml*` (Lexical → HTML) and
server-rendered RTE. Lexical's text nodes are escaped by the default
converter. No path where user-submitted text reaches `SafeHtml`
unescaped was found in this pass.

One spot to watch: the custom heading converter in
`src/utilities/rteToHtml.ts` interpolates `headingNode.id` into an
attribute:

```tsx
const id = headingNode.id ? ` id="${headingNode.id}"` : '';
return `<${tag}${id}>${childrenHtml}</${tag}>`;
```

The `id` is always produced by
`slugify(..., { strict: true, lower: true })` inside
`processLexicalNodes`, so it is a-z/0-9/hyphen only — safe today. Add
an explicit sanitizer (e.g. `[a-z0-9-]` allowlist) as a guard if
someone later widens the slug rules.

---

### G. LOW: Server action `verifyZenodo` is an unauthenticated remote fetch

`src/app/actions/zenodo.ts` fetches
`https://zenodo.org/api/records/${parsedId}?access_token=${token}`
using a server-side token, with no auth check on the caller. It
validates `id` is a positive integer, so SSRF is blocked. Impact is
limited to:

- Consuming the Zenodo token quota from anonymous traffic
- Leaking Zenodo record metadata that is already public

Still, consider gating this action behind `payload.auth({ headers })`
since it only exists to support the admin "verify zenodo" UI, not the
public frontend.

---

## Prioritized Remediation Order

| #  | Severity | Issue                                                                 | File(s)                                                            |
|----|----------|-----------------------------------------------------------------------|--------------------------------------------------------------------|
| 1  | Critical | Tenants `read` + `update` unauth                                      | `src/access/tenants.ts`, `src/plugins/index.ts`                    |
| 2  | High     | Form server action trusts client `formDefinition` (mail relay)        | `src/app/actions/submitForm.ts`, `src/components/blocks/Form/Form.component.tsx` |
| 3  | High     | `/api/access` schema disclosure                                       | middleware + resolution of #1                                      |
| 4  | Medium   | User enumeration via forgot-password                                  | override `/api/users/forgot-password`                              |
| 5  | Medium   | Missing security headers + CSP                                        | `next.config.mjs`                                                  |
| 6  | Medium   | No login rate limit / lockout                                         | `src/collections/Plc/Users/index.ts` (`auth.maxLoginAttempts`)     |
| 7  | Medium   | No CORS/CSRF allowlist                                                | `src/payload.config.ts`                                            |
| 8  | Low      | GraphQL Playground exposed                                            | `src/app/(payload)/api/graphql-playground/route.ts`                |
| 9  | Low      | `roles` not in JWT                                                    | `src/collections/Plc/Users/index.ts`                               |
| 10 | Low      | `verifyZenodo` action unauth                                          | `src/app/actions/zenodo.ts`                                        |

---

## Appendix — Confirmed-Not-Exploitable Surfaces

The following surfaces were probed and returned the expected
restrictive behavior:

- `GET /api/users` (unauth)      → `403`
- `POST /api/users` (unauth, trying to self-assign `super-admin`) → `403`
- `GET /api/images|videos|documents|people|projects|teams|forms|redirects` (unauth) → `403`
- `POST /api/tenants` (create, unauth) → `403`
- `DELETE /api/tenants/:id` (unauth) → `403`
- Redirect validation enforces locale-prefixed internal paths, so the
  redirect "open redirect" class is not currently exploitable (see
  `src/hooks-payload/validateRedirectLocalePrefix/index.ts`).
- Tenant-admin cross-tenant operations → `403` (as reported).
- Tenant-admin cannot update super-admin user records → confirmed.

## Next Steps

Recommend starting with items 1 and 2 (directly exploitable today),
then 3–7 in order. Items 8–10 can be batched into a cleanup PR. After
each change run:

```bash
tsc --noEmit
pnpm payload generate:importmap   # if admin components changed
pnpm payload generate:types       # if schema changed
```
