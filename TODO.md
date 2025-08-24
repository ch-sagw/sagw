Backup / Restore:
-----------------
- test blob backup/restore with lots of large image files

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
- Properly configure sentry. we don't want sentry complaining on localhost

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
- add indication on payload ui if author is on test or prod
- richt-text sanitize: should we search for "  " and replace by " "? other optimizations?

Vercel:
--------
- Disable branch protection for test? https://vercel.com/dev-0f45b8a0/sagw/settings/deployment-protection

Payload Config:
--------
- earlyCareerAward -> winnersTeasers -> make select with with winners detail pages
- prepopulate seo on collections
- multiTenantPlugin Tenants index.ts -> allowPublicRead, needed?
- implement hidden texts global config (for a11y)
