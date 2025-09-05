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
- sanitize form-inputs (in app)

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

Payload Config:
--------
- implement hidden texts global config (for a11y)
- slug: add a slug-field to all pages! currently, we don't have slugs, but just id's. If we go for slugs -> make validation hook to ensure unique slugs per tenant
- in general, grant api read access to collections only if collection is published
- add indication on payload ui if author is on test or prod
- set access control on all blocks/collections
- layout fields in rows where appropriate. e.g. with link internal: the 3 fields can be in 1 row
- show "published" column in collection overview
- i don't see too much added value for our use-case for the formbuilder plugin. -> implement own solution
- add descriptions to collections: what is this collection for?
- care about redirects: check redirects-plugin and decide if we use it or create our own
- About SAGW -> Link block below RTE is missing. How do we do it? Add a "LinkBlock"? Or do we extend the RTE element with a linkBlock?
- remove tenantsCollectionsObject['forms'] = {}; in form-refactor pr

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
