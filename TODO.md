Backup / Restore:
-----------------
- test blob backup/restore with lots of large image files
- adapt replicate task to also replicate blob to local

Storybook:
----------

Github:
-------
- add branch restrictions on main
- add test sharding to deploy-prod.yml
- add sharding for be tests as well

Resend:
-------
- Create SAGW account
- Add SAGW Resend token to env file
- Write test to see if mail content is correct

NextJs:
-------
- sanitize form-inputs (in app)
- generate sitemap
- icons: make sure only the icons are in the dist bundle which are actually needed. same for logo component.

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
- Header -> Navigation -> fine-grain "required": on level 1, linkTarget is not required, on level 2 it is. If level 1 has no sub-nav items, linkTarget is required.
- BUG: with empty database or with initial seed: go to home, add downloads block, click document dropdown -> "Es ist ein fehler aufgetreten". SAME FOR IMAGE.

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
- limit blocks on all pages
- add admin ui images for blocks: generic teaser, footnotes


---
!!
- check hooks, if they work after migrating to rte1
- check admin - conditions for string comparisons
- useMemo for rteToHtml conversion?


Multitenant: (working with seed data)
--------
- issue: on autologin, tenant-cookie is not set after login -> create github issue

Misc:
--------
- update docs on env-vars
- update docs on deployments

Testing:
-------
