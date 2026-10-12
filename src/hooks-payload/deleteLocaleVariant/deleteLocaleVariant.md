# Delete a single language variant of a page

Pages are localized documents: one document holds the content of all
languages (`de`, `fr`, `it`, `en`). Payload's built-in actions (unpublish,
delete) always affect the whole document. This feature adds an action in the
admin edit view that removes **one** language variant of a page while keeping
the other languages intact.

## Editor's view

In the edit view of a page, the three-dot menu (next to the save/publish
buttons) contains the entry **"Löschen (Sprachvariante)"**. It is only shown
when all of the following apply:

- the admin UI is switched to a language other than German (`de`) — German is
  the default/fallback language and cannot be deleted; delete the whole page
  instead
- the current user may delete the page (same permission as the built-in
  "Delete")
- the page has content in the current language (the slug field is not empty)

Clicking the entry opens a confirmation dialog. On confirm:

- all content of the current language is removed from the page and from
  **all stored versions** of the page (irreversible — a version restore cannot
  bring the language back)
- the page is no longer reachable under its URL in that language (there is no
  slug in that language anymore, so the URL lookup returns 404)
- the edit view reloads in the same language; the localized fields are now
  empty

After the deletion the page behaves exactly like a page that was **never
translated** into that language. In particular, Payload's locale fallback
(`fallback: true` in `src/i18n/payloadConfig.ts`) still applies:

- in teaser lists (news, events, publications, …) the page may still appear in
  that language, showing the German texts; its link points to the German URL
  (`alternateLocaleForMissingPath`)
- the language switcher and hreflang links skip the language, like for any
  untranslated page

Nothing else is changed: child pages, internal links or references to the page
are not checked or modified.

## Scope

The action is available on all page collections of the sets
(`src/collections/Pages/Sets`). It is **not** available on the singletons
(`homePage`, `errorPage`, `dataPrivacyPage`, `impressumPage`): their slug is
not stored in the document but generated from the i18n messages in an
`afterRead` hook, so removing the content would not make the page unreachable
— it would simply render the German fallback under the same URL.

The eligible slugs are defined in
`src/hooks-payload/deleteLocaleVariant/constants.ts`.

## Implementation

All server-side code lives in `src/hooks-payload/deleteLocaleVariant/`.

### Why DB-level writes

Payload's `update` operation cannot "unset" a locale: data is always merged
with the existing document and localized required fields would fail
validation. Therefore `deleteLocaleFromDocument` reads the raw document via
`payload.db.findOne`, removes the locale keys with `stripLocale` and writes it
back via `payload.db.updateOne`. Versions are handled the same way with
`payload.db.findVersions` / `payload.db.updateVersion`.

Consequences:

- collection hooks and validation do **not** run for this write; the endpoint
  therefore calls `invalidateCache` itself
- the write runs inside a Payload transaction (`initTransaction` /
  `commitTransaction`) - on MongoDB this only takes effect with a replica set

`stripLocale` walks the collection's field config (tabs, groups, rows,
collapsibles, arrays, blocks incl. `blockReferences`) and deletes
`value[locale]` wherever a field or tab is localized. Localized arrays/blocks
are removed as a whole for that locale; non-localized arrays/blocks are
traversed so that localized fields inside them are stripped as well.

### Endpoint

`POST /api/<collection>/<id>/delete-locale` with body `{ "locale": "fr" }`.

| Status | Reason                                                                   |
| ------ | ------------------------------------------------------------------------ |
| 200    | `{ id, locale, versionsUpdated }`                                        |
| 400    | unknown locale, default locale, or language not enabled for the tenant   |
| 401    | no user                                                                  |
| 403    | the collection's `access.delete` denies the user (same rule as "Delete") |
| 404    | unknown collection or document                                           |

The endpoint is only registered on eligible collections, so e.g.
`/api/homePage/<id>/delete-locale` or `/api/dataPrivacyPage/<id>/delete-locale`
return 404.
