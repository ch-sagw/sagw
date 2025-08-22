Backup / Restore:
-----------------
- mongo-db has a config db, which is mainly for cluster-meta. do we have to backup/restore it as well?
- test blob backup/restore with lots of large image files
- we have databases sagwtest and sagwprod. but auth happens via admin. in backup/restore, we should also backup and restore admin.
- after creating db-prod instance, make sure vercel cron jobs still run as expected
- check ovh backup/restore mechanism on ovh

Storybook:
----------
- deploy storybook!

Github:
-------
- add branch restrictions on main
- github -> security -> code scan -> complaints about missing workflow permissions

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
- make sure that zenodo endpoint is only available from localhost. if not feasible, move the zenodo request to a server component instead of using an api.

Payload:
--------
- set hideAPIURL to true on prod for non admins: https://payloadcms.com/docs/configuration/collections#admin-options
- implement live-preview
- implement versions
- implement trash
- collection "consent" is saved to db-collections "consents". Mongo Config: autoPluralization
- correctly set SERVER_URL based on ENV
- implement draft preview: https://payloadcms.com/docs/admin/preview#draft-preview
- implement document locking: https://payloadcms.com/docs/admin/locked-documents
- implement resend
- add indication on payload ui if author is on test or prod

Vercel:
--------
- Disable branch protection for test? https://vercel.com/dev-0f45b8a0/sagw/settings/deployment-protection

OVH / DB:
--------
- connect ovh object storage to cyberduck

Payload Config:
--------
- earlyCareerAward -> winnersTeasers -> make select with with winners detail pages
- prepopulate seo on collections
- change all richText fields to rte1 or rte2
- allow hyphen in rte1 & rte2
- configure rte2 properly
- add validation for external link href
- add custom rte component for internal/external links, remove default link button in rte
- multiTenantPlugin Tenants index.ts -> allowPublicRead, needed?
- implement hidden texts global config (for a11y)

Testing:
-------
