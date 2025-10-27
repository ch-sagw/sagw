Backup / Restore:
-----------------
- test blob backup/restore with lots of large image files

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
- icons: make sure only the icons are in the dist bundle which are actually needed. same for logo component.
- create revalidation server function, call it from afterChange hook accordingly

Payload:
--------
- set hideAPIURL to true on prod for non admins: https://payloadcms.com/docs/configuration/collections#admin-options
- implement live-preview
- implement trash
- correctly set SERVER_URL based on ENV
- implement draft preview: https://payloadcms.com/docs/admin/preview#draft-preview
- implement document locking: https://payloadcms.com/docs/admin/locked-documents
- implement resend
- Header -> Navigation -> fine-grain "required": on level 1, linkTarget is not required, on level 2 it is. If level 1 has no sub-nav items, linkTarget is required.
- internal link chooser in overlay (rte) also shows draft documents!
- whenever we import configPromise (payload.config.ts), then the init method seems to run!! (this is where we seed data). This might have severe performance implications. find workaround!
- request bloat internal link chooser: e.g. on header, if you have 7 nav items, the internal link chooser queries 7 times all collections!
- test: plc -> people -> beforeChange hook for full name

Vercel:
--------
- Disable branch protection for test? https://vercel.com/dev-0f45b8a0/sagw/settings/deployment-protection
- Early Hints (HTTP status 103), e.g. for font-loading?

Payload Config:
--------
- in general, grant api read access to collections only if collection is published
- set access control on all blocks/collections
- layout fields in rows where appropriate. e.g. with link internal: the 3 fields can be in 1 row
- show "published" column in collection overview
- care about redirects: check redirects-plugin and decide if we use it or create our own
- add admin ui images for blocks: generic teaser, footnotes

Misc:
--------
- update docs on env-vars
- update docs on deployments
- stories: for teasers and overviews, we have a duplicate, almost same stories (on block level and on baese level)
- thin out snapshots: either screenshot blocks or base components, not both

Testing:
-------

QUESTIONS:
-------
- newsTeasers, eventsTeasers, downloadBlock, linkBlock -> no option to choose color scheme?
