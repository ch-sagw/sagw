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
- Write test to see if mail content is correct

NextJs:
-------
- sanitize form-inputs (in app)
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
- for formfields: name field should have a custom validation regex (lowercase, no spaces, only dashes)

Vercel:
--------
- Disable branch protection for test? https://vercel.com/dev-0f45b8a0/sagw/settings/deployment-protection
- Early Hints (HTTP status 103), e.g. for font-loading?

Payload Config:
--------
- implement hidden texts global config (for a11y)
- in general, grant api read access to collections only if collection is published
- set access control on all blocks/collections
- layout fields in rows where appropriate. e.g. with link internal: the 3 fields can be in 1 row
- show "published" column in collection overview
- add descriptions to collections: what is this collection for?
- care about redirects: check redirects-plugin and decide if we use it or create our own
- About SAGW -> Link block below RTE is missing. How do we do it? Add a "LinkBlock"? Or do we extend the RTE element with a linkBlock?
- slug error? after dev:seed, go to magazine detail and add a block -> error that the slug already exists
- limit blocks on all pages
- implement cololr-theme chooser for FG's

Multitenant: (working with seed data)
--------
- issue: on autologin, tenant-cookie is not set after login -> create github issue

Misc:
--------
- update docs on env-vars
- update docs on deployments

Testing:
-------
