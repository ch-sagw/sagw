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


Misc:
--------
- update docs on env-vars
- update docs on deployments

Testing:
-------


REFACTOR:
-------
- for publication detail, we had authors array: add authors like foo, bar and baz, so that we can render: "Von: foo, bar, baz."
- refine globals, especially i18n
- introduce collection "Reusable Text": author can define "Publikation herunterladen" in 4 languages. Then, he can choose this as title in the PublicationsTeasersBlock
- add color-scheme property to blocks
- create global nav structure