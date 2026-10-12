# Unused Assets Cleanup

The CMS periodically looks for images, videos and documents that are **not used anywhere anymore** and removes them (database entry and file in the storage). Every run produces a report which is sent by mail and posted to Slack.

The job is built around one rule: **an asset that is still in use is never deleted. When in doubt, it is kept.**

- [For editors and admins](#for-editors-and-admins)
- [For developers](#for-developers)

---

## What happens?

- **Production:** on the 1st of every month (03:00 UTC) the job runs and deletes assets which have been unused for **at least 3 weeks**.
- **Test environment:** every night (02:00 UTC), assets unused for **at least 1 day** are deleted.

After each run you receive a mail with a detailed report for your tenant: which assets were deleted, which ones were kept and why. On production the mail goes to the admins of each tenant, on the test environment to a single technical address.

## What counts as "in use"?

An asset is considered in use (and is therefore kept) if it is referenced anywhere in the CMS, including:

- any page or content block (image, video, teaser, downloads, hero, SEO image, ...)
- people, teams, projects, categories, forms, header, footer, ...
- **drafts and all older versions** of pages – an image that is only part of a previous version is kept
- **downloads by project:** if a page shows "all documents of project X" automatically, every document of project X is kept
- **URLs pasted as text:** if the URL of an asset was copied and pasted into a text (link, rich text, external link, redirect, ...), the asset is kept
- documents which are currently being edited (locked) by someone

Additionally, the job never deletes assets that were uploaded or changed recently (3 weeks on production, 1 day on test). This gives editors time to upload something first and place it on a page later.

## What does the job delete?

Only assets that are

1. older than the safety window (see above), **and**
2. referenced nowhere, **and**
3. not blocked by one of the safety fuses (see below).

Deleting removes the CMS entry and the file from the storage. Deleted assets cannot be restored – if something is needed again, it must be uploaded again.

## Safety fuses

The job refuses to delete anything at all if something looks wrong, for example:

- the scan of the content could not be completed
- the two independent reference checks disagree
- no content was found at all
- too many assets of a tenant would be deleted at once (more than 25% or more than 50 in one run)

In these cases the mail report says why nothing was deleted. Either reduce the amount by deleting obviously unused assets manually in the admin panel, or – for a large backlog like the very first cleanup – let a developer temporarily raise the limits (see [Initial cleanup on production](#initial-cleanup-on-production)). Loosened limits are highlighted in every report.

## Report-only mode

The job can run in **report-only mode**: it scans everything and lists what *would* be deleted, but touches nothing. This is the default on production and test until the setting `ASSETS_CLEANUP_MODE=delete` is enabled by a developer.

## Slack

Each run posts a short summary to Slack (if the webhook is configured). The message contains `[PROD]`, `[TEST]` or `[LOCAL]` so the environments are easy to tell apart. Only the automated tests never post to Slack.

If something went wrong, the Slack message makes it obvious:

- **finished WITH PROBLEMS**: the run completed, but e.g. a deletion failed, a file is still in the storage, the content scan reported errors or a mail could not be sent. Each problem is listed with its details.
- **FAILED**: the run crashed before it could finish. The message contains the reason and technical details.

---

## How a run works

1. **Scan.** All Mongo collections except the asset collections and `payload-jobs` / `payload-migrations` are read raw (`payload.db.collections[slug].find().lean().cursor()`), including every `_versions` collection. Two independent collectors build the reference index:
   - *Generic collector:* walks every value of every document and collects all 24-hex strings (ids), all url/filename-like tokens (raw, query-stripped, url-decoded) plus the complete strings, and the project ids of `downloadsBlock` with `customOrAuto: 'auto'`.
   - *Schema collector:* walks the Payload field config (tabs, groups, rows, arrays, blocks incl. `blockReferences`, localized maps, polymorphic relations) and collects ids of `upload`/`relationship` fields pointing to `images`, `videos` or `documents`.
2. **Race protection.** Everything with `updatedAt >= scanStart` is scanned a second time and merged.
3. **Invariant.** `schemaIds ⊆ genericIds` must hold. If the schema collector knows an id the generic one missed, something is wrong with the scan and nothing is deleted. The violation is listed under *Problems* in the Slack message and in the mail.
4. **Evaluation per tenant.** An asset becomes a candidate only if `createdAt` **and** `updatedAt` are older than the cutoff and none of these is true:
   - id is referenced
   - filename (raw or `encodeURIComponent`) is in the referenced filenames or appears as substring in the url corpus
   - the asset id appears in the url corpus
   - document belongs to a project used by an auto downloads block
   - the asset has no filename (kept – unclear state)
5. **Fuses.** Global (scan errors, invariant violation, zero docs, report mode) and per tenant (more than `maxDeletePercent` when at least 10 candidates, more than `maxDeleteAbsolute`). Any fuse -> nothing is deleted for that scope.
6. **Deletion.** Per candidate: re-read `updatedAt` (skip if changed or gone) -> `payload.delete` (the Vercel Blob storage plugin removes the blob in its `afterDelete`) -> verify with `@vercel/blob` `head()` that the blob is gone (`deleted`, `blobStillPresent`, or `blobNotVerified` when no `BLOB_READ_WRITE_TOKEN` is available).
7. **Report & notify.** Report is stored as task output in `payload-jobs` (visible for super admins under *System -> Jobs*), mailed and posted to Slack. `collectReportProblems()` in `report.ts` decides whether the Slack message is a plain summary or marked *WITH PROBLEMS* (scan errors, invariant violations, failed deletions, blobs still present, failed mails).
8. **Crashes.** If the run throws, `runAssetsCleanup` posts a *FAILED* message with reason and stack to Slack (`sendSlackFailure`) and rethrows, so the job is marked as errored. The cron route does the same for errors outside the job (payload init, queueing). Nothing is sent to Sentry on purpose.

## Environments and modes

| | prod | test | local (`npm run dev`) | playwright |
|-|-|-|-|-|
| Safety window | 21 days (can only be extended) | 1 day | 1 day | 1 day |
| Delete mode | only with `ASSETS_CLEANUP_MODE=delete` | only with `ASSETS_CLEANUP_MODE=delete` | task input `mode: 'delete'` or env var | task input `mode: 'delete'` |
| Fuse limits | env vars set the limits, task input can only tighten | env vars set the limits, task input can only tighten | free | free |
| Mail | tenant admins (fallback super admins, fallback `vorhall23@gmail.com`) | one combined mail to `vorhall23@gmail.com` | one combined mail to `vorhall23@gmail.com` | off (unless `notify: true`) |
| Slack | `[PROD]` | `[TEST]` | `[LOCAL]` (if webhook set) | off |
| Trigger | Vercel Cron `0 3 1 * *` | GitHub Action `assets-cleanup-test.yml` `0 2 * * *` | `npm run assets:cleanup` | spec |

Environment is detected from `process.env.ENV` (`prod`, `test`, `local`, `playwright`). Without `ENV` in a non-production build it is treated as `local`; in a production build as `unknown`. An `unknown` environment **never deletes** – not even with `ASSETS_CLEANUP_MODE=delete` – it only reports (prod safety window, mail to the fallback address) so the misconfiguration gets noticed. This rule is enforced twice: in `resolveMode()` (`config.ts`) and again in the final gate `isDeleteModeConfirmed()` (`deleteAsset.ts`).

## Environment variables

| Variable | Where | Purpose |
|-|-|-|
| `ASSETS_CLEANUP_MODE` | Vercel (prod, test) | `delete` enables deletion. Anything else = report-only. |
| `ASSETS_CLEANUP_MAX_DELETE_PERCENT` | Vercel (prod, test), optional | Overrides the per-tenant percent fuse (default 25). Only used for exceptional runs, see below. Invalid or non-positive values are ignored. |
| `ASSETS_CLEANUP_MAX_DELETE_ABSOLUTE` | Vercel (prod, test), optional | Overrides the per-tenant absolute fuse (default 50). Only used for exceptional runs, see below. Invalid or non-positive values are ignored. |
| `CRON_SECRET` | Vercel (prod, test) + GitHub secret | Must be set by you (long random value). Vercel Cron sends the configured value as bearer token to `/api/cron/assets-cleanup`; without it every request is rejected (401). The GitHub Action needs the test value as repository secret. |
| `SLACK_WEBHOOK_URL_ASSETS_DELETE` | Vercel (prod, test), optionally local | Slack incoming webhook, set per environment: prod posts to its own channel, test and local share a second channel (set in `.env.prod`, `.env.test`, `.env.local` – not in `.env.base`). If set locally, `npm run assets:cleanup` posts `[LOCAL]` messages (`--no-notify` suppresses them). |
| `TEST_ENV_URL` | GitHub repository secret | Base URL of the test environment, used by the nightly workflow. |
| `BLOB_READ_WRITE_TOKEN` | Vercel / local | Needed by the storage plugin to delete blobs and by the job to verify the deletion. Without it, deletions are reported as `blobNotVerified`. |
| `NEXT_PUBLIC_SERVER_URL` | all | Used for admin links in the reports. |

See also [env-vars.md](/docs/env-vars.md).

## Trigger manually

```bash
# deployed environments (report or delete depends on ASSETS_CLEANUP_MODE)
curl -H "Authorization: Bearer $CRON_SECRET" https://<host>/api/cron/assets-cleanup

# local dev, report only
npm run assets:cleanup

# local dev, delete (against your local db/blob!)
npm run assets:cleanup -- --delete --no-notify

# GitHub: Actions -> "Assets cleanup (test environment)" -> Run workflow
```

The route accepts `?notify=false` to suppress mail and Slack (used by the tests).

## Initial cleanup on production

Production will start with a backlog: many tenants will have far more than 25% unused assets or more than 50 candidates. With the default fuses, nothing would be deleted for those tenants. The intended procedure:

1. Keep `ASSETS_CLEANUP_MODE` unset (report-only) and trigger a run manually (`curl` above) or wait for the scheduled run. Review the report mails / the job in *System -> Assets Cleanup Runs*: check the candidate lists, especially documents and assets with an unusual filename.
2. When the candidates look right, set on Vercel (production): `ASSETS_CLEANUP_MODE=delete`, `ASSETS_CLEANUP_MAX_DELETE_PERCENT=100` and `ASSETS_CLEANUP_MAX_DELETE_ABSOLUTE=<a number above the largest tenant's candidate count>`. Redeploy or wait for the env vars to take effect.
3. Trigger the run manually with the `curl` command. The report (mail, Slack, admin panel) is marked with *Safety limits were loosened for this run* and lists the overrides, so it is obvious that this was an exceptional run.
4. Remove the two `ASSETS_CLEANUP_MAX_DELETE_*` variables again. From now on the monthly run works with the default fuses.

Task inputs (`maxDeletePercent`, `maxDeleteAbsolute`) cannot loosen the limits on deployed environments – env variables are the only way, on purpose: they need Vercel access, are visible in the project settings and are picked up by every report.

Every run is stored as a job in `payload-jobs` (admin panel: *System -> Jobs*, super admins only) with the full report as task output. There is no job runner polling the queue: jobs are queued and executed immediately by the route / cli via `payload.jobs.runByID`. Task inputs (`mode`, `minAgeDays`, `tenantIds`, `notify`, `maxDeletePercent`, `maxDeleteAbsolute`) can be passed programmatically through `queueAndRunAssetsCleanup`; on deployed environments they cannot weaken the safety settings.

## Tests

`src/jobs/assetsCleanup/assetsCleanup.api.be.spec.ts` contains a whole testsuite to make sure the assetsCleanup routine works as expected.

## Extending

- **New asset collection?** Add the slug to `assetCollectionSlugs` in `config.ts`. Both collectors and `loadAssets` work from that list.
- **New field type that stores references in an unusual shape?** The generic collector will still catch ids and urls in strings. If the schema collector misses it, the invariant does not trip (it only guards the other direction) – add handling to `collectSchema.ts` if the type should be covered by both.
- **Collections that must never be scanned** (e.g. stored reports) go to `excludedScanCollections`. Do not exclude content collections.
