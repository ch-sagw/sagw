Backup / Restore:
-----------------
- test blob backup/restore with lots of large image files
- adapt replicate task to also replicate blob to local

Storybook:
----------
- deploy storybook!

Github:
-------
- add branch restrictions on main

Resend:
-------
- Create SAGW account
- Add SAGW Resend token to env file

Sentry:
-------
- Install https://payloadcms.com/docs/plugins/sentry

NextJs:
-------

Payload:
--------
- set hideAPIURL to true on prod for non admins: https://payloadcms.com/docs/configuration/collections#admin-options
- implement live-preview
- implement versions
- implement trash
- correctly set SERVER_URL based on ENV
- implement draft preview: https://payloadcms.com/docs/admin/preview#draft-preview
- implement document locking: https://payloadcms.com/docs/admin/locked-documents
- implement resend

Vercel:
--------
- Disable branch protection for test? https://vercel.com/dev-0f45b8a0/sagw/settings/deployment-protection

Payload Config:
--------
- earlyCareerAward -> winnersTeasers -> make select with with winners detail pages
- implement hidden texts global config (for a11y)
- slug: add a slug-field to all pages! currently, we don't have slugs, but just id's. If we go for slugs -> make validation hook to ensure unique slugs per tenant
- zenodo -> checks if validated id is already in connection. make this check per tenant. currently, if one tenant adds an id, another tenant can't add the same id.
- in general, grant api read access to collections only, if collection is published
- add indication on payload ui if author is on test or prod
- richt-text sanitize: should we search for "  " and replace by " "? other optimizations?
- in departments overview, there is a column "_watch Tenant" ... ?
- for departments, make name, url and slug unique
- set access control on all blocks/collections
- in tenant config, add field for available languages: https://payloadcms.com/docs/configuration/localization#filter-available-options
- strange behavior with autosave: e.g. in collection "documents"
  - enable draft versions and autosave in documents collection (removed for now in all collections due to errors)
  - go to detailPage, add a new one
  - in content section, add downloads block
  - click on the + sign to add a new "Document"
  - in the overlay -> choose a new document to upload
  - hit save -> error
- other strange behaviour with autosave:
  - go to detail page and add a new one (enable autosave. commented out in detail page code)
  - a block downloads block or a link block to a page with autosave enabled (just examples, we might have issues in other places as well)
  - thinks like admin: { condition: ...} are not working.
  - additonally, e.g. for radio fields, the defaultValue is not working


Misc:
--------
- update docs on env-vars
- update docs on deployments

Testing:
-------


REFACTOR:
-------
- refine globals, especially i18n
- introduce collection "Reusable Text": author can define "Publikation herunterladen" in 4 languages. Then, he can choose this as title in the PublicationsTeasersBlock
- create global nav structure
- fix test / create new seed data
- add descriptions to collections: what is this collection for?