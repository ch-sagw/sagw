# Tracking (Fathom Analytics)

The website uses [Fathom Analytics](https://usefathom.com) for privacy friendly, cookie-less analytics. **Every tenant has its own Fathom dashboard.** Besides pageviews, a handful of interactions are counted as Fathom *events*: external link clicks, magazine article exports, downloads, form submissions and video views.

- [For editors and admins](#for-editors-and-admins)
- [For developers](#for-developers)

---

## For editors and admins

### Where do I find my numbers?

Every tenant has its own Fathom site. Pageviews and events of a tenant only show up in that tenant's dashboard, never in another tenant's. Log in to Fathom and select the site of your tenant.

Events are listed in the dashboard under **Events**. Every event name is listed with the number of completions and unique completions. Fathom aggregates events per name, so the names below are stable and must not be changed (renaming an event in the code would start a new event in Fathom and break the history).

### Consent

Nothing is tracked before the visitor accepts **analytics** in the cookie banner. If the visitor declines analytics, the tracking script is not even loaded. This applies to pageviews and to all events below.

### What is tracked?

For every interaction two events are counted: a **total** per category (e.g. `Download`) and a **per item** event (e.g. `Download: Jahresbericht 2024`). This gives you the overall number at a glance and the detail list (which document, which form, which video, ...) in the same dashboard.

| Interaction | Total event | Per item event (example) |
|-|-|-|
| Click on a network item (external link) | `Network link` | `Network link: Schweizerische Gesellschaft für Soziologie` |
| Click on an edition (external link) | `Edition link` | `Edition link: Bulletin 1/2024` |
| Click on an external link in the links block of a **national dictionary** detail page | `National dictionary link` | `National dictionary link: Artikel auf Zenodo` |
| Click on an external link in the links block of an **institute** detail page | `Institute link` | `Institute link: Website des Instituts` |
| Click on an **external event** (event without detail page) in events overview or events teaser | `External event link` | `External event link: Jahreskongress 2026` |
| Click on "Export article" on a magazine article | `Magazine article export` | `Magazine article export: <article title>` |
| Click on a download in a downloads block (document or Zenodo file) | `Download` | `Download: Jahresbericht 2024` |
| Successful form submission (custom forms and newsletter forms) | `Form submission` | `Form submission: Kontaktformular` |
| Video started (first play per page view) | `Video view` | `Video view: <video title>` |

The per item label is the title the visitor sees (network item title, edition title, link text, event title, article title, document title, form title, video title). Formatting, special characters and emojis are removed, long labels are cut at 100 characters.

### External link clicks in detail

Only these five kinds of external links are tracked:

1. **Network items** – the cards of the "Network" block. The whole card links to the external website of the network item.
2. **Editions** – the cards of the "Editions overview" block. The whole card links to the external website of the edition.
3. **National dictionaries** – external links (`Link type: External`) in the **links block** on a national dictionary detail page.
4. **Institutes** – external links (`Link type: External`) in the **links block** on an institute detail page.
5. **External events** – events where "Show detail page" is set to *No* and a link to an external page is configured. Clicks are tracked in the events overview and in the events teaser.

Not tracked: internal links and e-mail links in a links block, links blocks on any other page type (e.g. a regular detail page), links in rich text, CTA blocks, header, footer and events with their own detail page.

### Form submissions

An event is counted once per **successful** submission (the success message is shown). Failed submissions (validation errors, server errors) are not counted. The label is the form title from the CMS. If a form has no title, the label is `newsletter <form id>` or `custom <form id>`.

### Downloads

Every click on an item in a downloads block counts as one download, regardless of whether the browser opens or saves the file. For Zenodo documents with several files, each file is its own item (`<title> - 1 / 2`, `<title> - 2 / 2`).

### Video views

One view is counted when the visitor starts a video (via our play button or the player controls), once per page view. Pausing and resuming does not count again.

### Adding a new tenant

Fathom site IDs are configured in the code, not in the CMS. To get a dashboard for a new tenant:

1. Create a new site in Fathom (name it after the tenant).
2. Ask a developer to add the tenant slug and the Fathom site ID to `src/tracking/fathomSites.ts` (see below).
3. Deploy.

**Important:** on production, a tenant that is not configured is **not tracked at all** (no pageviews, no events).

---

## For developers

### Overview

```
RenderPage / RenderNotFoundPage (server)
  └─ resolveFathomSiteId({ tenantSlug })        src/tracking/fathomSites.ts
       └─ <TrackingProvider siteId>              src/components/helpers/tracking.tsx
            ├─ FathomTracker: load / setSite / trackPageview (consent gated)
            └─ context { siteId, trackingAllowed }
                 ├─ useTrackEvent()               src/components/helpers/useTrackEvent.ts
                 └─ <TrackedLink trackingEvents>  src/components/base/TrackedLink
```

- The site ID is resolved **server side** per request from the tenant slug and `process.env.ENV`. Only the resolved ID reaches the client.
- `TrackingProvider` loads the Fathom script once (`load(siteId, { auto: false })`), calls `setSite(siteId)` and tracks a pageview for every route change. Both happen in the same effect order, so pageviews are always attributed to the current tenant, also during client side navigation between tenants.
- `trackingAllowed = !NEXT_PUBLIC_TRACKING_DISABLED && analytics consent && siteId`.
- Events are sent with `trackEvent(name, { _site_id: siteId })`, i.e. the site is passed explicitly per event (see [Fathom: multiple site IDs on one site](https://usefathom.com/docs/script/multiple-site-ids)).

### Per-tenant site IDs: `src/tracking/fathomSites.ts`

```ts
export const fathomSites: FathomSitesMap = {
  playwright: { 'not-sagw': 'PWNOTSAGW' },
  prod: { sagw: 'LZIJGWTS' },
  test: {},
};
```

The map is keyed by environment (`process.env.ENV`) and tenant **slug**. Site IDs are public (they are part of the tracking script tag), so committing them is fine.

`resolveFathomSiteId({ tenantSlug })`:

| `ENV` | Resolution |
|-|-|
| `prod` | Map entry, else **no tracking**. `NEXT_PUBLIC_TRACKING_SITE_ID` is ignored. |
| `test` | Map entry, else `NEXT_PUBLIC_TRACKING_SITE_ID` (one shared test site for all tenants), else off. |
| `playwright` | Map entry, else `NEXT_PUBLIC_TRACKING_SITE_ID` (shared playwright site). The `sagw` tenant is intentionally **not** in the map so the real-API tests can query the shared site. `not-sagw` has a fake ID which is only asserted by stubbed tests. |
| `local` / unset | Like `test`. Normally tracking is off locally via `NEXT_PUBLIC_TRACKING_DISABLED=true`. |

**Adding a tenant on prod:** add `'<tenant-slug>': '<SITE_ID>'` to `fathomSites.prod`. `src/tracking/fathomSites.be.spec.ts` checks that prod IDs are non-empty and unique.

### Event names: `src/components/helpers/tracking.constants.ts`

```ts
TRACKING_EVENTS = {
  download: 'Download',
  editionLink: 'Edition link',
  externalEventLink: 'External event link',
  formSubmission: 'Form submission',
  instituteLink: 'Institute link',
  magazineArticleExport: 'Magazine article export',
  nationalDictionaryLink: 'National dictionary link',
  networkLink: 'Network link',
  videoView: 'Video view',
}
```

- `buildTrackingEventName(prefix, label)` → `prefix` or `prefix: label`. The label is cleaned with `toTrackingLabel` (HTML tags and entities removed, emojis/control chars removed, whitespace collapsed) and the result is capped at `TRACKING_EVENT_MAX_LENGTH` (100) characters. No ellipsis is added (Fathom asks to avoid special characters).
- `buildTrackingEvents(prefix, label)` → `[prefix, 'prefix: label']` (only `[prefix]` if the label is empty). This is what every instrumented component passes around.
- **Never rename an existing prefix.** Fathom aggregates by name; a rename starts a new event and the history is split.

### Instrumented places

| Requirement | Where | How |
|-|-|-|
| network items | `blocks/NetworkTeaser/NetworkTeaser.tsx` | `link.trackingEvents` on the `GenericTeaser` card (`TrackedLink`) |
| editions | `blocks/EditionsOverview/EditionsOverview.tsx` | same |
| links block | `blocks/Links/Links.tsx` + `Links.tracking.ts` | `RenderBlocks` passes `sourceCollectionSlug`; only `nationalDictionaryDetailPage` / `instituteDetailPage` get a prefix (`trackedLinksBlockPages`); only `linkType === 'external'` items get events. Rendered via `DownloadLinkItem` → `TrackedLink` |
| external events | `blocks/helpers/dataTransformers.ts` (`convertPayloadEventPagesToFeItems`) → `base/EventsListItem` | events get `trackingEvents` only when `showDetailPage === 'false'`; used by events overview and events teaser |
| export | `global/Hero/Hero.tsx` (`handleExport`) | `useTrackEvent()` at the start of the handler, independent of PDF success |
| downloads | `blocks/Downloads/Downloads.tsx` | documents and every Zenodo file get `trackingEvents` → `DownloadLinkItem` |
| forms | `blocks/Form/Form.server.tsx` builds the label, `Form.client.tsx` fires once when `submitSuccess` becomes true | |
| video | `blocks/Video/Video.tsx` | `trackView()` on our overlay click and on the player's `onPlay`, guarded by a ref (once per mount) |

To instrument something new: build the names with `buildTrackingEvents(TRACKING_EVENTS.x, label)` and either render a `TrackedLink` with `trackingEvents`, or call the function returned by `useTrackEvent()` in a client component. Add the new prefix to `TRACKING_EVENTS` and to the tables in this document.

### Environment variables

| Variable | prod | test | local | playwright |
|-|-|-|-|-|
| `NEXT_PUBLIC_TRACKING_SITE_ID` | **not read** (map only) | shared test site | optional | shared playwright site (`BIFOPTRI`) |
| `NEXT_PUBLIC_TRACKING_DISABLED` | unset | unset | `true` | `true` (re-enabled per test via cookie `fathom_playwright_e2e=1`) |
| `FATHOM_API_KEY` | – | – | – | read-only API key, only for `tracking.be.spec.ts` |

See also [env-vars.md](/docs/env-vars.md).

### Tests

| Spec | What |
|-|-|
| `src/tracking/fathomSites.be.spec.ts` | Pure: resolution rules per environment, prod map sanity (non-empty, unique, lower case slugs), `sagw` not in the playwright map. |
| `src/components/helpers/trackingEventName.be.spec.ts` | Pure: `toTrackingLabel`, `buildTrackingEventName`, `buildTrackingEvents`, uniqueness of `TRACKING_EVENTS`. |
| `src/components/helpers/tracking-events.be.spec.ts` | Browser, **stubbed Fathom**: per-tenant site ID (sagw vs. not-sagw), no script before consent / after decline, and one positive (and where relevant one negative) case for every requirement 1–7. |
| `src/components/helpers/tracking.be.spec.ts` | Browser, **real Fathom API** (skipped without `FATHOM_API_KEY`): pageviews are only recorded after consent, and a `Download` event arrives in Fathom. |

The stub (`src/test-helpers/fathom-stub.ts`) intercepts `cdn.usefathom.com/script.js` and records every `load`, `setSite`, `trackPageview` and `trackEvent` call in `window.__fathomCalls`. `preventLinkNavigation` keeps external links and downloads from leaving the page. `setupTrackingPage(page)` installs the stub, the navigation guard and the consent cookies in one call; `expectTrackedEvents(page, names)` polls for the expected event names.

The real-API helper (`src/test-helpers/fathom.ts`) uses `GET /v1/aggregations` with `entity=pageview&entity_id=<site>` for pageviews and `entity=event&site_id=<site>&entity_name=<name>` for events (goal codes are no longer supported by Fathom). Fathom needs a while to aggregate, so these tests poll with a 7 s interval (API rate limit: 10 aggregations per minute).

Run the BE tests as usual (`npm run test:be`). To run only the tracking specs:

```bash
docker compose -f docker-compose.yml run --rm be npx playwright test -c playwright-be.config.ts src/tracking src/components/helpers/tracking
```
