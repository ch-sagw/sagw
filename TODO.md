Backup / Restore:
-----------------
- mongo-db has a config db, which is mainly for cluster-meta. do we have to backup/restore it as well?
- test blob backup/restore with lots of large image files

Storybook:
----------
- deploy storybook?

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
- make sure that zenodo endpoint is only available from localhost

Payload:
--------
- Generate types: when is it run? do we have to run in automatically, e.g. on ci, on postinstall etc?
- set hideAPIURL to true on prod: https://payloadcms.com/docs/configuration/collections#admin-options
- live-preview
- versions
- trash
- hide api for non-admin roles
- collection "consent" is saved to db-collections "consents"

OVH / DB:
--------
- currently, ovh db instance only has admin user. make 2 more users (one for usage in app, the other as backup). Save store these logins at vorhall
- currently, the app uses admin db. use sagw db.

Payload Config:
--------
- earlyCareerAward -> winnersTeasers -> make select with with winners detail pages
- limit upload in images, video, documents to corresponding type
- finish global i18n (cta forms)
- prepopulate seo on collections
- change all richText fields to rte1 or rte2
- allow hyphen in rte1 & rte2
- configure rte2 properly
- add validation for external link href
- add custom rte component for internal/external links, remove default link button in rte
- multiTenantPlugin Tenants index.ts -> allowPublicRead, needed?

Testing:
-------
