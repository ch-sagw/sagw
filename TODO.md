Backup / Restore:
-----------------
- test blob backup/restore with lots of large image files
- adapt replicate task to also replicate blob to local

Storybook:
----------

Github:
-------
- add branch restrictions on main

Resend:
-------
- Create SAGW account
- Add SAGW Resend token to env file

NextJs:
-------
- generate sitemap

Payload:
--------
- set hideAPIURL to true on prod for non admins: https://payloadcms.com/docs/configuration/collections#admin-options
- implement live-preview
- implement trash
- correctly set SERVER_URL based on ENV
- implement draft preview: https://payloadcms.com/docs/admin/preview#draft-preview
- implement document locking: https://payloadcms.com/docs/admin/locked-documents
- implement resend

Vercel:
--------
- Disable branch protection for test? https://vercel.com/dev-0f45b8a0/sagw/settings/deployment-protection
- Early Hints (HTTP status 103), e.g. for font-loading?

Payload Config:
--------
- implement hidden texts global config (for a11y)
- in general, grant api read access to collections only if collection is published
- richt-text sanitize: should we search for "  " and replace by " "? other optimizations?
- set access control on all blocks/collections
- layout fields in rows where appropriate. e.g. with link internal: the 3 fields can be in 1 row
- show "published" column in collection overview
- i don't see too much added value for our use-case for the formbuilder plugin. -> implement own solution
- do we need OverviewPage and DetailPage? One should be enough?
- add descriptions to collections: what is this collection for?
- care about redirects: check redirects-plugin and decide if we use it or create our own

Multitenant: (working with seed data)
--------
- issue: on autologin, tenant-cookie is not set after login -> create github issue
- issue v3.54.0, ok in v3.52.0: multi-tenant & versions and global collection: can't be created if db empty: "Error creating autosave global multi tenant document for homePage"... department seems undefined -> create github issue

Misc:
--------
- update docs on env-vars
- update docs on deployments

Testing:
-------

ASK STELLA:
-------
- introduce collection "Reusable Text"? author can define "Publikation herunterladen" in 4 languages. Then, he can choose this as title in the PublicationsTeasersBlock